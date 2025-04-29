export const API_URL = `${process.env.API_ORIGIN}/v1/wff-cohort-26`;
export const settings = {
    headers:{
      autohorization:`${process.env.API_TOKEN}`,
      'Content-Type': 'application/json'
    }
};
