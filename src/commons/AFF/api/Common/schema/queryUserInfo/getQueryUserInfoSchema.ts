import { IDO } from "data-model-service";

export default function getQueryUserInfoSchema() {
  return {
    "username": {
      "type": "string",
      "from": "username",
      "default": "",
      "elementType": "string"
    },
    "id": {
      "type": "string",
      "from": "id",
      "default": "",
      "elementType": "string"
    },
    "phone": {
      "type": "string",
      "from": "phone",
      "default": "",
      "elementType": "string"
    },
    "age": {
      "type": "number",
      "from": "age",
      "default": -1,
      "elementType": "number"
    }
  };
}
						
export type IQueryUserInfoDO = IDO<ReturnType<typeof getQueryUserInfoSchema>>;