
import { addMonths } from "date-fns";

export interface GroupFormData {
  name: string;
  description: string;
  targetAmount: number;
  endDate: Date;
}

export const getInitialFormData = (): GroupFormData => ({
  name: "",
  description: "",
  targetAmount: 0,
  endDate: addMonths(new Date(), 3),
});
