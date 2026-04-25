import { cn } from '@/lib/utils';
import { getGradeColour } from '@/lib/gradeColours';

interface GradeChipProps {
  grade: string;
  gradeSystem?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function GradeChip({ grade, gradeSystem, className, size = 'md' }: GradeChipProps) {
  const colourClass = getGradeColour(grade, gradeSystem);
  return (
    <span
      className={cn(
        'grade-chip', colourClass,
        size === 'sm' && 'text-[10px] px-2 py-0.5',
        className,
      )}
    >
      {grade}
    </span>
  );
}
