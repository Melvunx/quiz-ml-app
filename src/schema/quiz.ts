import { z } from "zod";

export const AnswerSchema = z.object({
  id: z.string(),
  content: z.string(),
  isCorrect: z.boolean(),
});

export const AnswersSchema = z.array(AnswerSchema);

export const QuestionSchema = z.object({
  id: z.string(),
  type: z.string(),
  content: z.string(),
  count_number_answers: z.object({
    value: z.number(),
  }),
  answers: AnswersSchema,
});

export const QuestionsSchema = z.array(QuestionSchema);

export const QuizSchema = z.object({
  title: z.string(),
  description: z.string(),
  count_number_questions: z.object({
    value: z.number(),
  }),
  questions: QuestionsSchema,
});

// Type definitions
export type Answer = z.infer<typeof AnswerSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type Quiz = z.infer<typeof QuizSchema>;
