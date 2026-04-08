with open("k8s/backend-deployment.yaml", "r") as f:
    c = f.read()
c = c.replace(
"""        vault.hashicorp.com/agent-inject-template-application.properties: |
          {{- with secret "secret/data/agri/db" -}}
          spring.data.mongodb.uri=mongodb://{{ .Data.data.username }}:{{ .Data.data.password }}@agri-mongodb:27017/agricultural_marketplace
          {{- end }}
    spec:
      serviceAccountName: agri-backend-sa
      containers:
      - name: agri-backend
        image: agri-backend:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8080""",
"""        vault.hashicorp.com/agent-inject-template-application.properties: |
          {{- with secret "secret/data/agri/db" -}}
          spring.data.mongodb.uri=mongodb://{{ .Data.data.username }}:{{ .Data.data.password }}@agri-mongodb:27017/agricultural_marketplace
          server.port=8080
          {{- end }}
    spec:
      serviceAccountName: agri-backend-sa
      containers:
      - name: agri-backend
        image: agri-backend:latest
        imagePullPolicy: IfNotPresent
        env:
        - name: SPRING_CONFIG_ADDITIONAL_LOCATION
          value: "file:/vault/secrets/application.properties"
        ports:
        - containerPort: 8080"""
)
with open("k8s/backend-deployment.yaml", "w") as f:
    f.write(c)
