import axios from "axios";
import { parseJwt } from '../misc/Helpers'
import { signIn,confirmSignIn,signOut,fetchAuthSession,decodeJWT } from "@aws-amplify/auth"; 


const TASK_API_BASE_URL="YOUR BASE URL"

const instance = axios.create({
  baseURL: TASK_API_BASE_URL
})

instance.interceptors.request.use(function (config) {
  // If token is expired, redirect user to login
  if (config.headers.Authorization) {
    const token = config.headers.Authorization.split(' ')[1]
    const data = token
    if (Date.now() > data.exp * 1000) {
      window.location.href = "/login"
    }
  }
  return config
}, function (error) {
  return Promise.reject(error)
})


function bearerAuth(user) {
  return `Bearer ${user.accessToken}`
}

class TaskService{

   async authenticate(email, password) {

    try {

      await signOut();

      const user = await signIn({ username: email, password }); // Sign in the user

      const session = await fetchAuthSession();
  
      if (!session) {
        throw new Error("User session is not available");
      }
  
      // Get the idToken from the user session
      const idToken = session.tokens;  // Extract JWT Token (idToken)

      return idToken; // Return the JWT token
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }

  }

    saveTask(task,user){

      return instance.post('/rtu/saveTask', task, {
        headers: {
          'Content-type': 'application/json',
          'Authorization': bearerAuth(user)
        }
      })

    }

    saveFlow(flow,user){

      return instance.post('/rtu/api/saveFlow', flow, {
        headers: {
          'Content-type': 'application/json',
          'Authorization': bearerAuth(user)
        }
      })
       
    }

    getFlow(flowId,user){

      const url = "/rtu/api/getFlow/"+flowId
      return instance.get(url, {
        headers: { 'Authorization': bearerAuth(user) }
      })

    }

    getFiles(user){

      const url = "/rtu/api/getFiles"
      return instance.get(url, {
        headers: { 'Authorization': bearerAuth(user) }
      })

    }

    getFilesByUser(username,user){
      
      const url = "/rtu/getFilesByUser/"+username
      return instance.get(url, {
        headers: { 'Authorization': bearerAuth(user) }
      })

    }

    getFile(fileId,user){

      const url = "/rtu/api/getFile/"+fileId
      return instance.get(url, {
        headers: { 'Authorization': bearerAuth(user) }
      })

    }

    forward(fileId,user){

      const url = "/rtu/api/forward/"+fileId
      return instance.get(url, {
        headers: { 'Authorization': bearerAuth(user) }
      })

    }

}

export default new TaskService();