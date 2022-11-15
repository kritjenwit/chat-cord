import { DateTime } from "luxon";

export const formatMessage = (username: string, text: string) => {
  const dt = DateTime.now().toFormat("h:mm a").toString()

  return {
    username,
    text,
    time: dt,
  };
};
