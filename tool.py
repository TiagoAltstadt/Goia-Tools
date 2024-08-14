import json

# Load the JSON data from a file
with open('data.json', 'r') as file:
    data = json.load(file)

# Initialize the ID counter
id_counter = 1

# Iterate over the objects and add the ID
for sublist in data['urls']:
    for obj in sublist:
        obj['id'] = id_counter
        id_counter += 1

# Save the updated JSON data back to the file
with open('data_with_ids.json', 'w') as file:
    json.dump(data, file, indent=2)

print("IDs added successfully!")
