Релізовано для практичної роботи 3

* Використано Type Aliases та Union Types для суворого визначення днів тижня, часових слотів (DayOfWeek, TimeSlot) та типів занять (CourseType).
* Створено Type Aliases для ключових сутностей: Professor, Classroom, Course, та Lesson (з унікальним ID для відстеження).
* Реалізовані функції додавання, видалення (cancelLesson) та модифікації (reassignClassroom) даних, що зберігаються у глобальних масивах (professors[], schedule[]).
* Створено механізм перевірки (validateLesson) для запобігання конфліктам розкладу (одночасна зайнятість аудиторії або викладача).
* Реалізовано функції пошуку вільних аудиторій (findAvailableClassrooms), отримання розкладу викладача (getProfessorSchedule) та звіти про використання ресурсів (getClassroomUtilization, getMostPopularCourseType).