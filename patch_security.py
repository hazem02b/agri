with open("k8s/backend-deployment.yaml", "r") as f:
    c = f.read()
c = c.replace(
"""          server.port=8080""",
"""          server.port=8080
          logging.level.org.springframework.security=DEBUG
          logging.level.org.springframework.web=DEBUG"""
)
with open("k8s/backend-deployment.yaml", "w") as f:
    f.write(c)
