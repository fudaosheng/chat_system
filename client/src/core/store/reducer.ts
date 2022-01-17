import { WebsocketState } from "core/typings";
import produce from "immer";
import { WebsocketActionResp, WebsocketActionType } from ".";

export const websocketReducer = (state: WebsocketState, action: WebsocketActionResp): WebsocketState => {
    return produce(state, draft => {
        switch(action.type) {
            case WebsocketActionType.CREATE_CHAT: {
                console.log(action.payload);
            }
        }
    })
}