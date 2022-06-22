import { CreateLessonInput } from './lesson.input';
import { LessonService } from './lesson.service';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { LessonType } from './lesson.type';
import { AssignStudentsToLessonInput } from './assign-students-to-lesson.input';
import { StudentType } from 'src/student/student.type';
import { Lesson } from './lesson.entity';
import { StudentService } from 'src/student/student.service';

@Resolver((_of) => LessonType)
export class LessonResolver {
  constructor(
    private lessonService: LessonService,
    private studentService: StudentService,
  ) {}

  @Query((_returns) => LessonType)
  lesson(@Args('lessonId') lessonId: string) {
    return this.lessonService.getLesson(lessonId);
  }

  @Query(() => [LessonType])
  lessons() {
    return this.lessonService.getLessons();
  }

  @Mutation((_returns) => LessonType)
  createLesson(
    @Args('createLessonInput') createLessonInput: CreateLessonInput,
  ) {
    return this.lessonService.createLesson(createLessonInput);
  }

  @Mutation(() => LessonType)
  assignStudentsToLesson(
    @Args('assignStudentsToLessonInput')
    assignStudentsToLessonInput: AssignStudentsToLessonInput,
  ) {
    const { lessonId, studentIds } = assignStudentsToLessonInput;
    return this.lessonService.assignStudentsToLesson(lessonId, studentIds);
  }

  @ResolveField(() => [StudentType])
  students(@Parent() lesson: Lesson) {
    const { studentIds = [] } = lesson;

    return this.studentService.getStudentsByIds(studentIds);
  }
}
