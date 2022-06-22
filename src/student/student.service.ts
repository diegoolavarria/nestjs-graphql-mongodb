import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentInput } from './create-student.input';
import { Student } from './student.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  getStudents = async (): Promise<Student[]> => {
    return this.studentRepository.find();
  };

  getStudentsByIds = async (studentIds: string[]): Promise<Student[]> => {
    return this.studentRepository.find({ where: { id: { $in: studentIds } } });
  };

  getStudent = async (studentId: string): Promise<Student> => {
    const student = this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return student;
  };

  createStudent = async (
    createStudentInput: CreateStudentInput,
  ): Promise<Student> => {
    const student = this.studentRepository.create({
      id: uuid(),
      ...createStudentInput,
    });

    return this.studentRepository.save(student);
  };
}
