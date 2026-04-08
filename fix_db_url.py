with open("k8s/backend-deployment.yaml", "r") as f:
    c = f.read()
import re
c = re.sub(
    r"spring\.data\.mongodb\.uri=.*",
    r"spring.data.mongodb.uri=mongodb://{{ .Data.data.username }}:{{ .Data.data.password }}@agri-mongodb:27017/agricultural_marketplace?authSource=admin",
    c
)
with open("k8s/backend-deployment.yaml", "w") as f:
    f.write(c)
