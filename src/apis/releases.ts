import axios from "axios"
import { BASE_PATH, PROJECT, RELEASES } from "./paths"

export const sendRelSet = async (data: any, projToken: string, projId: number) => {
  const config = {
    headers: {
      'X-Project-Token': `${projToken}`
    }
  };
  try {
    const res = await axios.post(BASE_PATH + RELEASES + PROJECT + projId, data, config)
    return res
  } catch (err: any) {
    console.log(`Failed to set release, Err: ${err.toString()}`);

  }

}