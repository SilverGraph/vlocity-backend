#!/bin/bash

# Admin and User credentials (no email, just username)
admin_username="admin"
admin_password="adminpass"
user_username="user"
user_password="userpass"
project_name="Project X"
project_description="Description of Project X"
project_members=("6812108005a3790e0e37efb6" "681214fa05a3790e0e37efbd")  # Replace with actual user IDs
created_by="6812105d05a3790e0e37efb4"  # Replace with the Admin's user ID

# Login as Admin to get JWT token
admin_token=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$admin_username\", \"password\": \"$admin_password\"}" \
  | jq -r '.token')

echo "Admin JWT token: $admin_token"

# Login as User to get JWT token
user_token=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$user_username\", \"password\": \"$user_password\"}" \
  | jq -r '.token')

echo "User JWT token: $user_token"

# Prepare members array as a string to ensure valid JSON formatting
members_json=$(printf '"%s",' "${project_members[@]}")
members_json="[${members_json%,}]"

# Create Project (Admin Only)
read -r -d '' create_project_payload <<EOF
{
  "name": "$project_name",
  "description": "$project_description",
  "members": $members_json,
  "createdBy": "$created_by"
}
EOF

create_project_response=$(curl -s -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer $admin_token" \
  -H "Content-Type: application/json" \
  -d "$create_project_payload")

echo "Create Project Response: $create_project_response"

project_id=$(echo "$create_project_response" | jq -r '._id')

# Optionally, create an Issue (Admin creates, User is assignee)
create_issue_response=$(curl -s -X POST http://localhost:5000/api/issues \
  -H "Authorization: Bearer $admin_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Issue 1",
    "description": "Issue description",
    "priority": "High",
    "project": "'$project_id'",
    "assignee": "'${project_members[0]}'"
  }')

echo "Create Issue Response: $create_issue_response"

# Create another Issue (Admin creates, assigned to user2)
create_issue2_response=$(curl -s -X POST http://localhost:5000/api/issues \
  -H "Authorization: Bearer $admin_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Issue 2",
    "description": "This is the second issue assigned to user2",
    "priority": "Medium",
    "project": "'$project_id'",
    "assignee": "'${project_members[1]}'"
  }')

echo "Create Issue 2 Response: $create_issue2_response"
