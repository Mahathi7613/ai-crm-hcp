from app.agent import extract_interaction_details


def log_interaction_tool(user_input):

    extracted_data = extract_interaction_details(user_input)

    return {
        "tool": "Log Interaction",
        "result": extracted_data
    }


def edit_interaction_tool():

    return {
        "tool": "Edit Interaction",
        "result": "Interaction updated successfully"
    }


def get_hcp_history_tool():

    return {
        "tool": "Get HCP History",
        "result": "Fetched previous interactions"
    }


def generate_followup_tool():

    return {
        "tool": "Generate Follow Up",
        "result": "Suggested follow-up generated"
    }


def schedule_followup_tool():

    return {
        "tool": "Schedule Follow Up",
        "result": "Follow-up scheduled"
    }