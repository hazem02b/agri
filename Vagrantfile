# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  # Utiliser une image officielle Ubuntu 22.04 LTS (Jammy Jellyfish)
  config.vm.box = "ubuntu/jammy64"
  
  # Configuration réseau (adresse IP fixe pour accéder au dashboard Horizon)
  config.vm.network "private_network", ip: "192.168.56.101"

  # Configuration des ressources (DevStack nécessite beaucoup de ressources)
  config.vm.provider "virtualbox" do |vb|
    vb.name = "devstack-node"
    vb.memory = "8192" # 8 Go de RAM minimum recommandé
    vb.cpus = 4        # 4 cœurs CPU
    # Permet la virtualisation imbriquée (Nested Virtualization) pour héberger des VMs dans OpenStack
    vb.customize ["modifyvm", :id, "--nested-hw-virt", "on"]
  end

  # Script de provisionnement (s'exécute automatiquement lors du premier `vagrant up`)
  config.vm.provision "shell", inline: <<-SHELL
    # 1. Mise à jour du système
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -y
    apt-get upgrade -y
    apt-get install -y git vim curl

    # 2. Création de l'utilisateur 'stack' et ajout aux sudoers
    useradd -s /bin/bash -d /opt/stack -m stack
    echo "stack ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers.d/stack
    chmod 0440 /etc/sudoers.d/stack

    # 3. Exécution avec l'utilisateur 'stack'
    sudo -u stack -i bash << 'EOF'
      # Télécharger le dépôt DevStack
      git clone https://opendev.org/openstack/devstack /opt/stack/devstack
      cd /opt/stack/devstack

      # Créer le fichier de configuration de DevStack
      cat << CONFFILE > local.conf
[[local|localrc]]
ADMIN_PASSWORD=secret
DATABASE_PASSWORD=secret
RABBIT_PASSWORD=secret
SERVICE_PASSWORD=secret
HOST_IP=192.168.56.101
CONFFILE

      # 4. Lancer l'installation de DevStack (peut prendre 15-30 minutes)
      echo "Démarrage de l'installation automatique de DevStack..."
      # ./stack.sh
      echo "L'installation a été provisionnée, connectez-vous avec 'vagrant ssh' et exécutez './stack.sh' dans /opt/stack/devstack"
EOF
  SHELL
end
