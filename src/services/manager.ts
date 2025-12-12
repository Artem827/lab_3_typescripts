import { Lesson, Professor, Classroom, Course, ScheduleConflict, TimeSlot, DayOfWeek, CourseType } from "../types/index";
import { professors, classrooms, courses, schedule, idCounter } from "../storage/index";

// --- ФУНКЦІЇ ДОДАВАННЯ ---

export function addProfessor(professor: Professor): void {
    professors.push(professor);
    console.log(`Професор ${professor.name} доданий до системи`);
}

export function addClassroom(classroom: Classroom): void {
    classrooms.push(classroom);
    console.log(`Аудиторія ${classroom.number} додана до системи`);
}

export function addCourse(course: Course): void {
    courses.push(course);
    console.log(`Курс ${course.name} доданий до системи`);
}

export function addLesson(lesson: Lesson): boolean {
    const conflict = validateLesson(lesson);

    if (conflict !== null) {
        console.log(`Неможливо додати заняття через конфлікт: ${conflict.type}`);
        return false;
    }

    if (!lesson.id) {
        lesson.id = idCounter.nextLessonId++;
    }

    schedule.push(lesson);
    console.log(`Заняття успішно додано (ID: ${lesson.id})`);
    return true;
}

// --- ВАЛІДАЦІЯ ---

export function validateLesson(lesson: Lesson): ScheduleConflict | null {
    const professorConflict = schedule.find(
        (l) =>
            l.professorId === lesson.professorId &&
            l.dayOfWeek === lesson.dayOfWeek &&
            l.timeSlot === lesson.timeSlot &&
            l.id !== lesson.id
    );

    if (professorConflict) {
        return {
            type: "ProfessorConflict",
            lessonDetails: professorConflict,
        };
    }

    const classroomConflict = schedule.find(
        (l) =>
            l.classroomNumber === lesson.classroomNumber &&
            l.dayOfWeek === lesson.dayOfWeek &&
            l.timeSlot === lesson.timeSlot &&
            l.id !== lesson.id
    );

    if (classroomConflict) {
        return {
            type: "ClassroomConflict",
            lessonDetails: classroomConflict,
        };
    }

    return null;
}

// --- ПОШУК ТА ЗВІТИ ---

export function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
    const occupiedClassrooms = schedule
        .filter((lesson) => lesson.dayOfWeek === dayOfWeek && lesson.timeSlot === timeSlot)
        .map((lesson) => lesson.classroomNumber);

    return classrooms
        .filter((classroom) => !occupiedClassrooms.includes(classroom.number))
        .map((classroom) => classroom.number);
}

export function getProfessorSchedule(professorId: number): Lesson[] {
    return schedule.filter((lesson) => lesson.professorId === professorId);
}

export function getClassroomUtilization(classroomNumber: string): number {
    const classroomLessons = schedule.filter(
        (lesson) => lesson.classroomNumber === classroomNumber
    );
    const totalSlots = 25; // 5 днів * 5 пар
    return Math.round((classroomLessons.length / totalSlots) * 100);
}

export function getMostPopularCourseType(): CourseType {
    const typeCounts: { [key in CourseType]?: number } = {};

    schedule.forEach((lesson) => {
        const course = courses.find((c) => c.id === lesson.courseId);
        if (course) {
            typeCounts[course.type] = (typeCounts[course.type] || 0) + 1;
        }
    });

    let maxCount = 0;
    let mostPopular: CourseType = "Lecture";

    for (const type in typeCounts) {
        if (typeCounts[type as CourseType]! > maxCount) {
            maxCount = typeCounts[type as CourseType]!;
            mostPopular = type as CourseType;
        }
    }
    return mostPopular;
}

export function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
    const lesson = schedule.find((l) => l.id === lessonId);
    if (!lesson) {
        console.log("Заняття не знайдено");
        return false;
    }

    const updatedLesson: Lesson = { ...lesson, classroomNumber: newClassroomNumber };
    const conflict = validateLesson(updatedLesson);

    if (conflict !== null && conflict.type === "ClassroomConflict") {
        console.log("Нова аудиторія зайнята в цей час");
        return false;
    }

    lesson.classroomNumber = newClassroomNumber;
    console.log(`Аудиторія для заняття ${lessonId} змінена на ${newClassroomNumber}`);
    return true;
}

export function cancelLesson(lessonId: number): void {
    const index = schedule.findIndex((lesson) => lesson.id === lessonId);
    if (index === -1) {
        console.log("Заняття не знайдено");
        return;
    }
    schedule.splice(index, 1);
    console.log(`Заняття ${lessonId} скасовано`);
}

export function printSchedule(): void {
    console.log("\n=== РОЗКЛАД ЗАНЯТЬ ===");
    schedule.forEach((lesson) => {
        const course = courses.find((c) => c.id === lesson.courseId);
        const professor = professors.find((p) => p.id === lesson.professorId);
        console.log(
            `ID: ${lesson.id} | ${lesson.dayOfWeek} ${lesson.timeSlot} | ` +
            `${course?.name} (${course?.type}) | ` +
            `Проф: ${professor?.name} | Ауд: ${lesson.classroomNumber}`
        );
    });
}