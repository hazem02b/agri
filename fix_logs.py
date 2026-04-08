with open("k8s/backend-deployment.yaml", "r") as f:
    c = f.read()
c = c.replace(
"""          logging.level.org.springframework.security=DEBUG
          logging.level.org.springframework.web=DEBUG
          logging.level.org.springframework.security=DEBUG
          logging.level.org.springframework.web=DEBUG""", ""
).replace("?authSource=admin\n\n          {{- end }}", "?authSource=admin\n          {{- end }}")

with open("k8s/backend-deployment.yaml", "w") as f:
    f.write(c)
