import json
from collections import defaultdict, Counter

def load_json(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        return json.load(file)

def save_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=2)

def extract_speaker(label):
    return label.split(':')[0].strip() if ':' in label else label

def create_root_node(speaker_ids):
    return {
        "@id": "resin:Events/DialogueRoot",
        "name": "Dialogue Root",
        "description": "Root node for dialogue",
        "isSchema": True,
        "repeatable": False,
        "outlinks": [],
        "participants": [],
        "children": [f"resin:Events/{speaker_id}" for speaker_id in speaker_ids],
        "children_gate": "or",
        "entities": [],
        "relations": [],
        "importance": [],
        "likelihood": []
    }

def convert_new_json_to_old(new_json):
    speakers = defaultdict(lambda: {
        "utterances": [],
        "interactions": Counter()
    })

    # Process nodes to extract speaker information and utterances
    for node in new_json["nodes"]:
        speaker = extract_speaker(node["data"].get("label", "Unknown Speaker"))
        speakers[speaker]["utterances"].append(node["data"].get("label", "No utterance"))

    # Process edges to record interactions between speakers
    for edge in new_json["edges"]:
        source_speaker = extract_speaker(new_json["nodes"][int(edge["source"])]["data"].get("label", "Unknown Speaker"))
        target_speaker = extract_speaker(new_json["nodes"][int(edge["target"])]["data"].get("label", "Unknown Speaker"))
        speakers[source_speaker]["interactions"][target_speaker] += 1

    # Create the events list for the output JSON
    events = []
    speaker_ids = list(speakers.keys())  # List of unique speaker identifiers
    for speaker_id, speaker_name in enumerate(speaker_ids):
        data = speakers[speaker_name]
        events.append({
            "@id": f"resin:Events/{speaker_id}",
            "name": speaker_name,
            "description": "Dialogue exchange",
            "isSchema": True,
            "repeatable": False,
            "outlinks": [],
            "participants": [],
            "children": [],
            "children_gate": "or",
            "entities": [],
            "relations": [
                {
                    "name": f"Dialogue ({data['interactions'][target]})",
                    "relationSubject": f"resin:Events/{speaker_id}",
                    "relationObject": f"resin:Events/{speaker_ids.index(target)}",
                    "@id": f"e{speaker_id}-{speaker_ids.index(target)}",
                    "utterances": data["utterances"]
                }
                for target in speaker_ids
                if data["interactions"][target] > 0
            ]
        })

    # After creating events for all speakers, add the root node
    root_node = create_root_node([f"{speaker_id}" for speaker_id in range(len(speaker_ids))])
    events.insert(0, root_node)  # Insert root at the beginning of the events list

    # Construct the final output JSON structure
    return {
        "@id": "resin:Schemas/dialogue",
        "sdfVersion": "3.0",
        "version": "resin:Phase2b",
        "events": events
    }

# Specify the input and output filenames
filename_to_convert = 'Peyton-pully-2.1-10.27.json'
output_filename = 'converted_output.json'

# Perform the conversion
new_json_data = load_json(filename_to_convert)
old_json_data = convert_new_json_to_old(new_json_data)
save_json(old_json_data, output_filename)