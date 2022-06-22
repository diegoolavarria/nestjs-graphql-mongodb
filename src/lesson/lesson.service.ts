import { CreateLessonInput } from './lesson.input';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { async } from 'rxjs';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
  ) {}

  getLesson = async (lessonId: string): Promise<Lesson> => {
    return await this.lessonRepository.findOne({ id: lessonId });
  };

  getLessons = async (): Promise<Lesson[]> => {
    return this.lessonRepository.find();
  };

  createLesson = async (
    createLessonInput: CreateLessonInput,
  ): Promise<Lesson> => {
    const lesson = this.lessonRepository.create({
      id: uuid(),
      ...createLessonInput,
    });

    return this.lessonRepository.save(lesson);
  };

  assignStudentsToLesson = async (
    lessonId: string,
    studentIds: string[],
  ): Promise<Lesson> => {
    const lesson = await this.lessonRepository.findOne({ id: lessonId });

    lesson.studentIds = [...lesson.studentIds, ...studentIds];

    return this.lessonRepository.save(lesson);
  };
}
