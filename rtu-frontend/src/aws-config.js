import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      region: "YOUR REGION",
      userPoolId: "YOUR POOL",
      userPoolClientId: "YOOUR USER POOL",
    },
  },
});