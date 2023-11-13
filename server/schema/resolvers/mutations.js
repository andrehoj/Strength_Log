import { User, Template } from "../../models/index.js";

import { AuthenticationError } from "apollo-server";
import { signToken } from "../../utils/auth.js";

const Mutation = {
  login: async function (_, { username, password }) {
    const user = await User.findOne({ username: username });

    if (!user) {
      throw new AuthenticationError("incorrect username");
    }

    const correctPassword = await user.isCorrectPassword(password);

    if (!correctPassword) {
      throw new AuthenticationError("incorrect password");
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

  createTemplate: async function (_, args) {
    try {
      // returns an array of templates. If the array has a length greater than 0, a template with the same name exists. return an error
      const template = await Template.find({
        templateName: args.templateName,
        belongsTo: args.userId,
      });

      if (template.length > 0) {
        return new Error(
          `Template with name "${template[0].templateName}" already exists`
        );
      }

      const tempPayload = {
        belongsTo: args.userId,
        templateName: args.templateName,
        templateNotes: args.templateNotes,
        exercises: args.exercises.map((e) => {
          return {
            exercise: e._id,
            sets: e.sets,
            restTime: e.restTime ? e.restTime : null,
          };
        }),
      };

      const temp = await Template.create(tempPayload);

      await User.findByIdAndUpdate(args.userId, {
        $push: { templates: [temp._id] },
      });

      return args.templateName;
    } catch (error) {
      return error.message;
    }
  },

  editTemplate: async function (_, args) {
    try {
      const template = await Template.findByIdAndUpdate(
        args.templateId,
        {
          templateName: args.templateName,
          templateNotes: args.templateNotes,

          exercises: args.exercises.map((exercise) => {
            return {
              exercise: exercise._id,
              restTime: exercise.restTime,
              sets: [...exercise.sets],
            };
          }),
        },

        { new: true }
      );

      return template;
    } catch (error) {
      return error.message;
    }
  },

  deleteTemplate: async function (_, { templateId }) {
    try {
      const template = await Template.findById(templateId);

      const res = await Template.deleteOne({ _id: templateId });

      await User.updateOne({
        $pull: { templates: templateId },
      });

      // remove deleted template from user.progress schema

      return { ...res, templateName: template.templateName };
    } catch (error) {
      return error.message;
    }
  },

  saveWorkout: async function (_, { templateId, userID, exercises }) {
    const compareDatesByDay = (firstDate, secondDate) =>
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate();
    try {
      // check if the same template was saved in the last 24 hours

      const user = await User.findByIdAndUpdate(
        userID,
        {
          $push: {
            completedWorkouts: {
              template: templateId,
              exercises: exercises.map((exercise) => {
                return {
                  exercise: exercise.exercise._id,
                  sets: [...exercise.sets],
                };
              }),
            },
          },
        },
        { new: true }
      ).select("-password");

      await User.findByIdAndUpdate(userID, {
        $push: {
          completedExercises: exercises.map((exercise) => {
            return {
              exercise: exercise.exercise._id,
              sets: exercise.sets.map((set) => set),
              belongsTo: templateId,
              savedOn: new Date(),
            };
          }),
        },
      });

      return user;
    } catch (error) {
      return error.message;
    }
  },

  deleteAccount: async function (_, { userID }) {
    try {
      const user = await User.findByIdAndDelete(userID);

      if (user) {
        return { confirm: true };
      }
      return { confirm: false };
    } catch (error) {
      return error.message;
    }
  },
};

export { Mutation };
