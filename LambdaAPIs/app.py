import json
import boto3
import uuid  # Import the UUID library
from boto3.dynamodb.types import TypeSerializer, TypeDeserializer

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Tasks")

def lambda_handler(event, context):
    print("Received event:", json.dumps(event, indent=2))

    path = event["path"]
    http_method = event["httpMethod"]

    # Handle different HTTP methods and paths
    if path == "/saveTask" and http_method == "POST":
        return saveTask(event)

    elif path.startswith("/getFilesByUser") and http_method == "GET":
        username = event.get("pathParameters", {}).get("username")
        if username:
            return getFilesByUser(event, username)  # Pass the username to the function
        else:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Username is required"}),
                "headers": {"Content-Type": "application/json"},
            }

    # Handle unsupported HTTP methods or paths
    return {
        "statusCode": 404,
        "body": json.dumps({"error": "Path not found or method not allowed"+path}),
        "headers": {"Content-Type": "application/json"},
    }

def saveTask(event):
    try:
        # Parse the body of the request
        data = json.loads(event["body"])
        
        taskId = str(uuid.uuid4())

        # Create the task object
        task = {
            "id": taskId,
            "taskName": data["taskName"],
            "completionDate": data["completionDate"],
            "assignDate": data["assignDate"],
            "assignTo": data["assignTo"],
            "state": 0,
            "completed": False,
        }

        # Insert the task into DynamoDB
        table.put_item(Item=task)

        # Return success response

        return {
            "statusCode": 201,
            "body": json.dumps({"message": "Task created successfully", "task": task}),
            "headers": {
            "Access-Control-Allow-Origin": "*",  # Allow all origins (change "*" to your frontend URL for better security)
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
        }

    except Exception as e:
        # Handle any exceptions and return an error message
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {"Content-Type": "application/json"},
        }

def getFilesByUser(event,username):
    try:
        # Extract path parameters

        if not username:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Username path parameter is required"}),
                "headers": {"Content-Type": "application/json"},
            }

        # Query DynamoDB using the Global Secondary Index (GSI)
        response = table.query(
            IndexName="assignTo-index",
            KeyConditionExpression="assignTo = :at",
            ExpressionAttributeValues={":at": username},
        )

        tasks = response['Items']

        tasks = dynamodb_to_json(tasks)

        if not tasks:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": "No tasks found for the user"}),
                "headers": {"Content-Type": "application/json"},
            }

        # Return the list of tasks for the user
        return {
            "statusCode": 200,
            "body": json.dumps(tasks),
            "headers": {
            "Access-Control-Allow-Origin": "*",  # Allow all origins (change "*" to your frontend URL for better security)
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
        }

    except Exception as e:
        # Handle any exceptions and return an error message
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {"Content-Type": "application/json"},
        }

def dynamodb_to_json(dynamodb_data):
    """Convert DynamoDB response to JSON serializable format."""
    serializer = TypeSerializer()
    return json.loads(json.dumps(dynamodb_data, default=str))