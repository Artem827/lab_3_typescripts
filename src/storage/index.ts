import { Professor, Classroom, Course, Lesson } from "../types/index";

export let professors: Professor[] = [];
export let classrooms: Classroom[] = [];
export let courses: Course[] = [];
export let schedule: Lesson[] = [];

export const idCounter = {
    nextLessonId: 1
};