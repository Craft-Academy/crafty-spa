import { Message } from "../model/message.entity";

export const buildMessage = ({
  id,
  text = "text",
  author = "author-id",
  publishedAt = "2023-06-07T15:00:00.000Z",
  likes = [],
}: {
  id: string;
  text?: string;
  author?: string;
  publishedAt?: string;
  likes?: string[];
}): Message => ({
  id,
  text,
  author,
  publishedAt,
  likes,
});
