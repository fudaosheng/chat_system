import request, { BaseResponse } from ".";

interface GetContactListResp extends BaseResponse {
    data: Array<DetailContactGroupInfo>;
}
export const getContactList = (): Promise<GetContactListResp> => request({
    url: '/contacts/get/contact_list'
})