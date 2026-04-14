#!/bin/bash
export VAULT_POD=$(kubectl get pods -n devsecops -l app.kubernetes.io/name=vault -o jsonpath="{.items[0].metadata.name}")

echo "Configuring Vault in pod: $VAULT_POD"

kubectl exec -n devsecops -it $VAULT_POD -- sh -c '
# Login
vault login root

# Activer le moteur de secrets (ignorer l erreur s il existe deja)
vault secrets enable -path=secret kv-v2 || true

# Creer les identifiants
vault kv put secret/agri/db username="agriuser" password="agripassword"

# Activer l auth kubernetes
vault auth enable kubernetes || true

# Configurer l auth K8s
# Vault a besoin de l adresse de l API interne K8s
vault write auth/kubernetes/config \
       kubernetes_host="https://$KUBERNETES_PORT_443_TCP_ADDR:443"

# Creer la politique (donner read sur le secret)
vault policy write agri-policy - <<EOP
path "secret/data/agri/db" {
  capabilities = ["read"]
}
EOP

# Creer le role K8s qui fait le lien entre le ServiceAccount "agri-backend-sa" et "agri-policy"
vault write auth/kubernetes/role/agri-backend-role \
       bound_service_account_names=agri-backend-sa \
       bound_service_account_namespaces=devsecops \
       policies=agri-policy \
       ttl=24h
'
