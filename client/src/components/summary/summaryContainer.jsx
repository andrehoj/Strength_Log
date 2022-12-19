import { motion, AnimatePresence } from "framer-motion";
import { Fragment } from "react";

export default function SummaryContainer({ isOpen, setIsOpen, res }) {
  return (
    <AnimatePresence>
      <div
        aria-hidden="true"
        className={`${isOpen ? "modal-container" : "hidden"}`}
      >
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="modal-body add-modal-height modal-scroll mx-2"
          >
            <div className="flex items-end justify-end">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className=" self-start bg-transparent hover:text-gray-500 rounded-lg text-sm px-3 py-1.5 ml-auto inline-flex justify-end bg-overlay_two"
                data-modal-toggle="defaultModal"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-5">
              {res.data.getProgress[0].template[0].templateName}
              {res.data.getProgress[0].template[0].exercises.map(
                (exercise, i) => (
                  <Fragment key={exercise.exerciseName}>
                    <p className="text-primary font-semibold text-3xl text-center">
                      {exercise.exerciseName}
                    </p>
                    <div className="flex justify-center items-center gap-2 mb-2 text-xl">
                      <span className="">
                        {exercise.sets} {exercise.sets && "x"}{" "}
                      </span>
                      <span className="">{exercise.reps}</span>
                      <span className="text-white_faded">
                        {exercise.weight && `${exercise.weight} (lbs)`}
                      </span>
                    </div>
                  </Fragment>
                )
              )}
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
