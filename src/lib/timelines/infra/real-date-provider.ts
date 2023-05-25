import { DateProvider } from "../model/date-provider";

export class RealDateProvider implements DateProvider {
  getNow(): Date {
    return new Date();
  }
}
