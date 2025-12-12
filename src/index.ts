import {
    addProfessor, addClassroom, addCourse, addLesson,
    printSchedule, findAvailableClassrooms, getProfessorSchedule,
    getClassroomUtilization, getMostPopularCourseType,
    reassignClassroom, cancelLesson
} from "./scheduleManager";
import { classrooms, courses } from "./data";

console.log(" СИСТЕМА УПРАВЛІННЯ РОЗКЛАДОМ УНІВЕРСИТЕТУ \n");

addProfessor({ id: 1, name: "Іваненко Іван Іванович", department: "Інформатика" });
addProfessor({ id: 2, name: "Петренко Петро Петрович", department: "Математика" });
addProfessor({ id: 3, name: "Сидоренко Олена Михайлівна", department: "Фізика" });

console.log();

addClassroom({ number: "101", capacity: 30, hasProjector: true });
addClassroom({ number: "102", capacity: 50, hasProjector: true });
addClassroom({ number: "201", capacity: 25, hasProjector: false });
addClassroom({ number: "202", capacity: 40, hasProjector: true });

console.log();

addCourse({ id: 1, name: "Програмування TypeScript", type: "Lecture" });
addCourse({ id: 2, name: "Дискретна математика", type: "Seminar" });
addCourse({ id: 3, name: "Лабораторія з фізики", type: "Lab" });
addCourse({ id: 4, name: "Практикум TypeScript", type: "Practice" });

console.log();
console.log(" ДОДАВАННЯ ЗАНЯТЬ ");

addLesson({
    courseId: 1,
    professorId: 1,
    classroomNumber: "101",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00",
});

addLesson({
    courseId: 2,
    professorId: 2,
    classroomNumber: "102",
    dayOfWeek: "Monday",
    timeSlot: "10:15-11:45",
});

addLesson({
    courseId: 3,
    professorId: 3,
    classroomNumber: "201",
    dayOfWeek: "Tuesday",
    timeSlot: "12:15-13:45",
});

addLesson({
    courseId: 4,
    professorId: 1,
    classroomNumber: "102",
    dayOfWeek: "Wednesday",
    timeSlot: "14:00-15:30",
});

console.log("\n ТЕСТ КОНФЛІКТУ ПРОФЕСОРА ");
addLesson({
    courseId: 2,
    professorId: 1,
    classroomNumber: "201",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00",
});

console.log("\n ТЕСТ КОНФЛІКТУ АУДИТОРІЇ ");
addLesson({
    courseId: 3,
    professorId: 2,
    classroomNumber: "101",
    dayOfWeek: "Monday",
    timeSlot: "8:30-10:00",
});

printSchedule();

console.log("\n ВІЛЬНІ АУДИТОРІЇ (Пн 8:30) ");
const available = findAvailableClassrooms("8:30-10:00", "Monday");
console.log(`Вільні: ${available.join(", ")}`);

console.log("\n РОЗКЛАД ПРОФЕСОРА (ID: 1) ");
const profSchedule = getProfessorSchedule(1);

console.log("\n АНАЛІЗ ТИПІВ ");
console.log(`Найпопулярніший тип: ${getMostPopularCourseType()}`);

profSchedule.forEach((lesson) => {
    const course = courses.find((c) => c.id === lesson.courseId);
    console.log(`  - ${lesson.dayOfWeek} ${lesson.timeSlot}: ${course?.name}`);
});
console.log("\n ЗМІНА ТА СКАСУВАННЯ ");
reassignClassroom(1, "202");
cancelLesson(3);

printSchedule();