import { Context, MiddlewareFn } from "telegraf";

export interface SessionData {
  test: string;
}

type BotSessionFlavor = { session: SessionData };

export type ReplyExtra = Parameters<Context["reply"]>[1];

export type ReplyWithNewMessage = (
  text: string,
  extra?: ReplyExtra
) => Promise<unknown>;

export interface BotReplyHelpers {
  replyWithNewMessage: ReplyWithNewMessage;
}

export type BotContext = Context & BotSessionFlavor & BotReplyHelpers;

export type BotEventType =
  | { type: "command"; command: string }
  | { type: "hears"; text: string | RegExp }
  | { type: "text" }
  | { type: "callback"; data?: string | RegExp };

export type BotMiddleware = MiddlewareFn<BotContext>;

export interface BotControllerMeta {
  event: BotEventType;
  middlewares?: BotMiddleware[];
}

export type BotHandler = (ctx: BotContext) => Promise<unknown> | unknown;

export interface BotController {
  meta: BotControllerMeta;
  handler: BotHandler;
}
