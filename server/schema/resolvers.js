const { User, Template, Exercise } = require("../models/index");
const { AuthenticationError } = require("apollo-server");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    getAllUsers: async function () {
      return User.find({}).populate({
        path: "templates",
        populate: {
          path: "exercises",
          model: "Exercise",
        },
      });
    },

    getAllTemplates: async function () {
      return Template.find().populate("exercises");
    },

    getAllExercises: async function () {
      return Exercise.find();
    },

    getUserById: async function (_, { _id }) {
      const user = await User.findById(_id)
        .select("-password")
        .populate({
          path: "templates",
          populate: {
            path: "exercises",
            model: "Exercise",
          },
        });

      return user;
    },

    getTemplatesForUser: async function (_, { userId }) {
      const user = await User.findById(userId)
        .select("-password")
        .populate({
          path: "templates",
          populate: {
            path: "exercises",
            model: "Exercise",
          },
        });

      return user.templates;
    },

    getProgress: async function (_, { templateName, userID }) {
      try {
        const user = await User.findById(userID);

        const progress = user.getProgress(templateName);

        return progress;
      } catch (error) {
        return error;
      }
    },

    getTemplateProgressForUser: async function (_, { userId }) {
      const user = await User.findById(userId)
        .select("-password")
        .populate({
          path: "templates",
          populate: {
            path: "exercises",
            model: "Exercise",
          },
        });

      return user.templates;
    },

    getChartData: async function (_, args) {
      const { progress } = await User.findById(args.userId).select("progress");

      const test = progress.filter((p) => {
        return p.templateName === args.templateName;
      });

      test.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

      const labels = test.map((progressObject) => {
        return progressObject.dateCompleted;
      });

      let copy = [...test];

      copy.forEach((resultObj, i) => {
        let total = resultObj.exercises.reduce(
          (accumulator, { weight, reps, sets }) => {
            return (accumulator += weight * reps * sets);
          },
          0
        );

        copy[i].totalWeight = total;
      });

      let totalWeight = copy.map((c) => {
        return c.totalWeight;
      });

      return { labels: labels, totalWeights: totalWeight };
    },

    async getExerciseProgress(_, { templateID, userID }) {
      await User.findById(userID);
    },

    async getTemplateModalProgress(_, { templateId, userId }) {
      const user = await User.findById(userId);

      user.getSortedProgress(templateId, "asc");

      return null;
    },

    async getSummary(_, { userId, templateId, progressId }) {
      const user = await User.findById(userId);

      const progress = user.getSortedProgress(templateId, "asc");

      function getRecentComparison(aryOfRecents, progressId) {
        let variable = [];

        aryOfRecents.forEach((recentObj, i) => {
          if (recentObj._id.toString() === progressId) {
            // if true we are at the first progressObj in array and there is no recent to compare
            // so only push the current recentbj data
            if (aryOfRecents.length - 1 === i) {
              variable.push(recentObj);
            } else {
              // else push the current and previous
              variable.push(recentObj);
              variable.push(aryOfRecents[i + 1]);
            }
          }
        });
        // if length is 1 we are only getting the first saved template so we dont need to get the difference
        if (variable.length <= 1) return variable;

        // compare exercise weight and add difference
        variable[0].exercises.forEach((exercise, i) => {
          variable[1].exercises[i].dif =
            exercise.weight - variable[1].exercises[i].weight;
        });

        return variable;
      }

      const summary = getRecentComparison(progress, progressId);

      return summary;
    },
  },

  Mutation: {
    login: async function (_, { username, password }) {
      const user = await User.findOne({ username: username });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken({
        username: user.username,
        _id: user._id,
      });

      return { token, user };
    },

    createUser: async function (_, { username, password }) {
      const isUsernameTaken = await User.findOne({ username: username });

      if (isUsernameTaken) {
        throw new AuthenticationError("Username is taken");
      }

      const user = await User.create({
        username: username,
        password: password,
      });

      const tokenData = { username: username, _id: user._id };

      const token = signToken(tokenData);

      return { token, user };
    },

    //create a template then push the new template ids to the User model
    createTemplate: async function (_, args) {
      try {
        const exercisesData = await Exercise.create(args.exercises);

        const exerciseIds = exercisesData.map((exercise) => {
          return exercise._id;
        });

        const templatePayload = {
          exercises: args.exercises,
          templateName: args.templateName,
          templateNotes: args.templateNotes,
        };

        const template = await Template.create(templatePayload);

        const { _id: templateId } = template;

        await User.findByIdAndUpdate(args.userId, {
          $push: { templates: [templateId] },
        });

        const userData = await User.findById(args.userId).populate({
          path: "templates",
          populate: {
            path: "exercises",
            model: "Exercise",
          },
        });

        const { templates } = userData;

        return templates;
      } catch (error) {
        return error.message;
      }
    },

    editTemplate: async function (_, args) {
      try {
        await Template.findByIdAndUpdate(
          args._id,
          {
            templateName: args.templateName,
            templateNotes: args.templateNotes,
            $set: { exercises: args.exercises },
          },

          { new: true }
        );

        return Template.findById(args._id);
      } catch (error) {
        return error.message;
      }
    },

    deleteTemplate: async function (_, { templateId }) {
      try {
        const res = await Template.deleteOne({ _id: templateId });

        await User.updateOne({
          $pull: { templates: templateId },
        });

        return res;
      } catch (error) {
        return error.message;
      }
    },

    saveWorkout: async function (_, { templateId, userID, exerciseInput }) {
      try {
        const template = await Template.findById(templateId);

        const user = await User.findByIdAndUpdate(
          userID,
          {
            $push: {
              progress: {
                templateName: template.templateName,
                exercises: exerciseInput,
                templateId: templateId,
              },
            },
          },
          { new: true }
        ).select("-password");

        return user;
      } catch (error) {
        return error.message;
      }
    },
  },
};

module.exports = resolvers;
