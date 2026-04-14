kubectl exec -n devsecops vault-0 -- vault auth enable kubernetes || true
kubectl exec -n devsecops vault-0 -- vault write auth/kubernetes/config \
    kubernetes_host="https://\$KUBERNETES_PORT_443_TCP_ADDR:443"

kubectl exec -n devsecops vault-0 -- sh -c 'cat << \EOF_POLICY > /tmp/agri-policy.hcl
path "secret/data/agri/*" {
  capabilities = ["read"]
}
EOF_POLICY'

kubectl exec -n devsecops vault-0 -- vault policy write agri-policy /tmp/agri-policy.hcl

kubectl exec -n devsecops vault-0 -- vault write auth/kubernetes/role/agri-backend-role \
    bound_service_account_names=vault-auth \
    bound_service_account_namespaces=devsecops \
    policies=agri-policy \
    ttl=24h

kubectl exec -n devsecops vault-0 -- vault kv put secret/agri/db \
    username=agriuser \
    password=agrisupersecurepass \
    cors=*

