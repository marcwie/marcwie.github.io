import json
import numpy as np

co_authors = []
unique_authors = set()

with open("content/publications/_index.md", "r") as data:
    data = data.read()
    data = data.split("---")[2]
    data = data.split("\n\n")
    data = [d for d in data if len(d)]
    for entry in data:
        entry = entry.split("\\")
        authors = entry[0]
        authors = authors.replace("*", "")
        authors = authors.split(",")
        authors = [a.replace("\n", " ") for a in authors]
        surnames = [a.split(".")[:-1] for a in authors]

        for i in range(1, len(surnames)):
            surnames[i] = ".".join(surnames[i]) + "."
            surnames[i] = surnames[i].replace(" ", "")

        s = surnames[0]
        s[0] = s[0].split(" ")[-1]
        surnames[0] = ".".join(s) + "."
        #surnames = [a.split(" ")[-2] for a  in authors]
        lastnames = [a.split(" ")[-1] for a  in authors]
        authors = [s+" "+l for s,l in zip(surnames, lastnames)]
        authors = [a for a in authors if a != "M. Wiedermann"]
        for a in authors:
            unique_authors.add(a)
        co_authors.append(authors)

author_indices = {author: _ for _, author in enumerate(unique_authors)}
adjacency = np.zeros((len(author_indices), len(author_indices)), dtype=int)

for author_list in co_authors:
    for author1 in author_list:
        for author2 in author_list:
            adjacency[author_indices[author1], author_indices[author2]] += 1

nodes_info = []
for author in unique_authors:
    nodes_info.append({"name": author})

links = np.array(np.nonzero(np.triu(adjacency, k=1))).T
links_info = []
for node_i, node_j in links:
    links_info.append({"source": int(node_i), "target": int(node_j), "weight":
                       int(adjacency[node_i, node_j])})

json_dic = {"nodes": nodes_info, "links": links_info}

with open("static/data/collaboration_network.json", "w") as output_file:
    json.dump(json_dic, output_file)
