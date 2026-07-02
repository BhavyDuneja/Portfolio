# KAGOYA CLOUD VPS — Detailed Infrastructure Learning Curriculum

> Granular **topics → subtopics → materials** for a tech newbie taking ownership of the Infra API → OpenStack → KVM layer.
> Work top-to-bottom; the order respects prerequisites. Version every lab artifact in Git from day one.

## Table of contents
1. [Phase 1 — Linux & Host Fundamentals](#phase-1-linux-host-fundamentals) — _9-11 weeks part-time (~8-10 hrs/week)_
2. [Phase 2 — KVM / libvirt / QEMU (the layer you own)](#phase-2-kvm-libvirt-qemu-the-layer-you-own) — _7-8 weeks part-time (~10-12 hrs/week)_
3. [Phase 3 — Networking, Deepened (→ Neutron-ready)](#phase-3-networking-deepened-neutronready) — _5-6 weeks, part-time (roughly 8-10 hrs/week; ~50-55 hrs total)_
4. [Phase 4 — APIs, Python, Git, Ansible (the seam)](#phase-4-apis-python-git-ansible-the-seam) — _12-16 weeks part-time (split 4A: weeks 1-8 HTTP/REST + Python; 4B: weeks 9-16 Git/Ansible/IaC/CI-CD)_
5. [Phase 5 — OpenStack Deep-Dive + Storage (ships the new plan)](#phase-5-openstack-deepdive-storage-ships-the-new-plan) — _10-12 weeks part-time + 1-2 weeks DevStack setup tax (so budget 12-14 weeks total)_
6. [Phase 6 — Operations, Reliability, Delivery & Migration](#phase-6-operations-reliability-delivery-migration) — _10–12 weeks part-time (~10–12 hrs/week)_

---

# Phase 1 — Linux & Host Fundamentals
**Duration:** 9-11 weeks part-time (~8-10 hrs/week)

> You now own the layer where customer VMs physically live: KVM hypervisor hosts running an OS, sitting under OpenStack and your Infra API. Before you can define a flavor, verify KVM capacity, or migrate off CentOS 7, you must be fluent and unafraid at a Linux shell — because a hypervisor host is just a Linux box where the kernel's KVM module turns it into a bare-metal (Type-1-style) hypervisor, each customer VM runs as a QEMU userspace process (qemu-kvm/qemu-system-x86_64) accelerated by KVM, every disk is a file or block device, and every outage you debug starts with journalctl and dmesg. (Mental model to get right early: KVM is the in-kernel hypervisor; QEMU is the userspace process that emulates devices and is accelerated BY KVM; libvirt is the management API/daemon you and OpenStack drive on top.) Work strictly hands-on: spin up a throwaway Rocky Linux 9 VM (and one CentOS 7 VM to feel the EOL pain) and run every command yourself — never just read. Treat your CentOS 7 hosts as the patient and Rocky/Alma 9 as where they're heading; everything you learn here maps to a real host you'll one day touch in production.

## 1. RHEL Family & Why It Matters (the OS your hosts run)
*Why it matters:* Your hypervisor hosts ARE the RHEL family — CentOS 7 today, Rocky/Alma 9 tomorrow. RPM, dnf, systemd, and SELinux are the exact mechanisms you'll use to patch hosts, install libvirt/qemu, and keep VMs from breaching isolation. Understanding the CentOS-to-Rocky/Alma lineage is the literal definition of your modernization goal.

### 1.1 What 'RHEL family' means: RHEL, CentOS Linux, CentOS Stream, Rocky, AlmaLinux  _(3-4 hrs)_
**Learn:** RHEL is the upstream-paid product; CentOS Linux (classic, 7/8) was its free downstream rebuild and is now discontinued; CentOS Stream is the rolling preview that sits UPSTREAM of RHEL (between Fedora and RHEL) — it is the development branch RHEL minor releases are cut from, NOT a downstream rebuild. Rocky Linux and AlmaLinux are the community downstream rebuilds aiming for binary/ABI compatibility with RHEL, created after Red Hat's 2020 decision to discontinue CentOS Linux 8. They share RPM, dnf, systemd, SELinux, package names, and binary compatibility — which is why a CentOS 7 -> Rocky 9 migration is realistic.

**📚 Materials:**
- Rocky Linux documentation: 'Release notes' and 'About' (docs.rockylinux.org)
- AlmaLinux documentation / wiki (wiki.almalinux.org)
- Red Hat Blog: 'Furthering the evolution of CentOS Stream' (Dec 2020 announcement — the change that ended CentOS Linux 8 and spawned Rocky/Alma) (verify URL)
- Red Hat Enterprise Linux 9 product documentation (docs.redhat.com/en/documentation/red_hat_enterprise_linux/9) — applies near-verbatim to Rocky/Alma 9

**🔧 Hands-on:**
- On your Rocky 9 lab VM: cat /etc/os-release and cat /etc/redhat-release
- Compare: spin up a CentOS 7 VM and run the same — note version 7 vs 9 and the 'CentOS Linux' vs 'Rocky Linux' name strings
- rpm -q rocky-release (or centos-release) to see the release-defining package

**✅ Self-check:**
- Why can a CentOS 7 host realistically migrate to Rocky 9 but not to Ubuntu, with minimal app changes?
- Is CentOS Stream upstream or downstream of RHEL, and why does that distinction matter for how 'tested' its packages are?

### 1.2 RPM: the package format and database  _(2-3 hrs)_
**Learn:** RPM is both a file format (.rpm) and a local database of what's installed. Every binary on your host — qemu-kvm, libvirt, openssh — came from an RPM. You query RPM to answer 'what version of libvirt is on this host?' and 'which package owns /etc/libvirt/qemu.conf?'.

**📚 Materials:**
- man rpm
- Fedora 'RPM Packaging Guide' — 'What is an RPM?' / 'Creating RPMs' sections (rpm-packaging-guide.github.io)
- RHEL 9 documentation: 'Managing software with the DNF tool' (docs.redhat.com)

**🔧 Hands-on:**
- rpm -qa | wc -l  (count installed packages)
- rpm -qi bash  (full metadata for one package)
- rpm -ql openssh-server  (list every file it installed)
- rpm -qf /etc/ssh/sshd_config  (which package owns this file?)
- rpm -V openssh-server  (verify files against the DB — detects tampering/config drift)

**✅ Self-check:**
- Given a mystery config file on a host, what single command tells you which package put it there?
- What does rpm -V output mean when a config file shows as modified, and why is that often expected/benign?

### 1.3 yum vs dnf: the package manager (and repos behind it)  _(2-3 hrs)_
**Learn:** yum (EL7) and dnf (EL8/9) resolve dependencies and pull RPMs from configured repositories. dnf is the modern replacement; on EL7 you use yum, on Rocky/Alma 9 the yum command is a compatibility symlink to dnf. This is how you install libvirt, apply security updates, and roll back.

**📚 Materials:**
- man dnf  and  man yum
- RHEL 9 documentation: 'Managing software with the DNF tool' (docs.redhat.com)
- DNF command reference (dnf.readthedocs.io)

**🔧 Hands-on:**
- dnf list --installed | head    and    dnf list --available | head
- dnf info httpd
- dnf check-update  (see pending updates without installing)
- sudo dnf install -y tree  then  sudo dnf remove -y tree
- dnf history  then  dnf history info <ID>  (every transaction is logged and reversible)
- On CentOS 7: run yum equivalents (yum list, yum history) to feel the difference

**✅ Self-check:**
- On a Rocky 9 host, what happens when you run 'yum install' — and why does it still work?
- How would you undo the last package transaction you ran?

### 1.4 systemd as the init system (first contact)  _(1-2 hrs)_
**Learn:** systemd is PID 1 — it boots the host, starts services (libvirtd, sshd, the OpenStack/nova compute agents), and manages dependencies/ordering between them. 'Knowing systemd' is non-negotiable for a host owner; this is a first orientation, with the deep dive in topic 7.

**📚 Materials:**
- man systemd  and  man systemctl
- RHEL 9 'Configuring basic system settings' — chapter on managing services with systemd/systemctl (docs.redhat.com)
- systemd upstream documentation index (systemd.io / freedesktop.org/wiki/Software/systemd)

**🔧 Hands-on:**
- systemctl status   (overall system state)
- systemctl list-units --type=service --state=running
- systemctl status sshd
- On a libvirt-enabled box later: systemctl status libvirtd

**✅ Self-check:**
- What is PID 1 on a modern RHEL-family host, and what is it responsible for?
- Name three services you'd expect systemd to manage on a hypervisor host.

### 1.5 SELinux: what it is and why hypervisor hosts keep it on  _(4-5 hrs)_
**Learn:** SELinux is Mandatory Access Control: even root-owned processes are confined by policy based on type labels, so a compromised qemu process can't read arbitrary host files. On hypervisors this is a real isolation layer — sVirt uses SELinux (or MCS categories) to give each VM's qemu process a distinct label so one VM can't touch another's image. You must understand Enforcing vs Permissive vs Disabled, how to read denials (AVCs), and why 'just disable SELinux' is the wrong reflex on multi-tenant infra.

**📚 Materials:**
- RHEL 9 'Using SELinux' guide — 'Getting started with SELinux', 'Changing SELinux states and modes', and the troubleshooting chapter (docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_selinux)
- man selinux, man getenforce, man setenforce, man semanage, man restorecon, man ausearch
- Digital Ocean: 'An Introduction to SELinux on CentOS 7' (concepts transfer to EL9) (verify URL)
- 'The SELinux Coloring Book' by Máirín Duffy (Red Hat, freely available PDF) (verify URL)

**🔧 Hands-on:**
- getenforce    and    sestatus
- ls -Z /etc/ssh/   (see the security-context labels)
- ps -eZ | grep sshd   (see a process's SELinux domain)
- sudo setenforce 0 then getenforce then sudo setenforce 1  (temporary, runtime-only toggle — it does NOT survive reboot; the persistent setting is /etc/selinux/config)
- Trigger and read a denial: sudo ausearch -m AVC -ts recent  (and, if installed, sealert/journalctl -t setroubleshoot)

**✅ Self-check:**
- What is the difference between Permissive and Enforcing mode, and which one still LOGS denials without blocking?
- Why is 'disable SELinux to fix the problem' dangerous on a multi-tenant hypervisor where sVirt isolates VMs?
- What does the -Z flag add to ls/ps output?

### 1.6 The CentOS 7 -> Rocky/Alma lineage and migration tooling (orientation only)  _(2 hrs)_
**Learn:** Two DISTINCT kinds of conversion exist and beginners routinely confuse them: (a) WITHIN-major distro swaps (migrate2rocky / almalinux-deploy convert e.g. a CentOS 8 box to Rocky 8 / Alma 8 in place — SAME major version, just changing the distro identity/repos) versus (b) ACROSS-major upgrades (ELevate/Leapp move EL7 -> EL8, or EL8 -> EL9). You go deep in topic 14; here just fix the map so you don't reach for the wrong tool.

**📚 Materials:**
- Rocky Linux: 'migrate2rocky' migration guide (docs.rockylinux.org) — note it targets SAME-major conversion
- AlmaLinux: 'almalinux-deploy' documentation (wiki.almalinux.org)
- AlmaLinux ELevate project (almalinux.org/elevate) — the across-major (EL7->EL8, EL8->EL9) path
- Cross-check guides (phoenixNAP / Tecmint 'CentOS to Rocky') (verify URL)

**🔧 Hands-on:**
- Read (do NOT run on anything real) the migrate2rocky.sh README and note its prerequisites and supported sources
- Sketch on paper: CentOS7 --ELevate/Leapp--> EL8 --ELevate/Leapp--> EL9; and CentOS8 --migrate2rocky--> Rocky8

**✅ Self-check:**
- Is migrate2rocky the right tool to move a CentOS 7 host to Rocky 9? Why or why not?
- What is the fundamental reason CentOS 7 cannot jump straight to EL9 in one in-place step?

## 2. Shell Literacy (your daily cockpit)
*Why it matters:* Every action you take on a host — checking a VM's qemu process, tailing a log, installing a package — happens at the shell. Misreading the prompt or an exit code is how beginners run the right command on the wrong host. man pages make you self-sufficient instead of dependent on copy-paste.

### 2.1 The prompt, the shell, and where you are  _(1-2 hrs)_
**Learn:** Read the prompt: which user (you vs root, $ vs #), which host, which directory. On a fleet of hypervisors, knowing WHICH host your prompt is on prevents disasters. Understand bash as the program interpreting your commands.

**📚 Materials:**
- The Linux Command Line (Shotts), 5th Internet Edition — Part 1: 'What Is the Shell?' and 'Navigation' (free PDF at linuxcommand.org/tlcl.php)
- man bash  (skim the INVOCATION and PROMPTING sections)

**🔧 Hands-on:**
- whoami; hostname; pwd  (the three 'where am I' questions)
- echo "$PS1"   (see your prompt's definition)
- su - then observe the prompt change from $ to #, then exit

**✅ Self-check:**
- Looking only at a prompt ending in '#', what do you know about your privileges?
- What three commands answer 'who am I, what host, what directory'?

### 2.2 Commands, arguments, flags, and reading usage  _(2 hrs)_
**Learn:** A command is program + options (flags) + arguments. Short flags (-l) vs long flags (--long), combining short flags (-la), and the convention of -- to end option parsing. Getting flags right is the difference between 'rm -r dir' and disaster.

**📚 Materials:**
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Working with Commands' and 'Redirection' (linuxcommand.org/tlcl.php)
- man man   and the SYNOPSIS notation convention explained in any man page

**🔧 Hands-on:**
- ls vs ls -l vs ls -la vs ls -lah  (observe each change)
- type ls; type cd; type rpm   (shell built-in vs external command vs alias)
- ls --help | head   (quick usage without the full man page)

**✅ Self-check:**
- In a man page SYNOPSIS, what do square brackets [ ] around an option mean?
- What does the bare '--' argument do in a command line?

### 2.3 $PATH and how commands are found  _(2 hrs)_
**Learn:** The shell finds executables by searching the directories listed in $PATH. This explains 'command not found', why root and your user may resolve different commands, and why scripts use full paths. Critical when an OpenStack CLI or Ansible tool 'isn't found' on one host but works on another.

**📚 Materials:**
- The Linux Command Line (Shotts), 5th Internet Ed. — 'The Environment' (linuxcommand.org/tlcl.php)
- man bash  (search for PATH)

**🔧 Hands-on:**
- echo "$PATH"    (read the colon-separated list)
- which ssh; which dnf; type -a ls
- command -v python3
- Create ~/bin/hello (a shebang script), chmod +x it, add ~/bin to PATH, run 'hello'

**✅ Self-check:**
- You get 'command not found' for a tool you know is installed. What two things do you check first?
- Why might 'sudo somecmd' fail with not-found while 'somecmd' works as your user? (hint: secure_path in sudoers)

### 2.4 Exit codes and what 'success' means  _(1-2 hrs)_
**Learn:** Every command returns an exit status: 0 = success, non-zero = failure. $? holds the last one. This is the foundation of scripting, &&/||, and Ansible's notion of failed tasks. You cannot automate host changes safely without it.

**📚 Materials:**
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Flow Control: Branching with if' (exit status section) (linuxcommand.org/tlcl.php)
- man bash  (EXIT STATUS section)

**🔧 Hands-on:**
- ls /etc; echo $?    (expect 0)
- ls /nonexistent; echo $?  (expect non-zero)
- true; echo $?   then   false; echo $?
- grep root /etc/passwd && echo FOUND || echo MISSING

**✅ Self-check:**
- What exit code means success, and how do you read the exit code of the last command?
- Write a one-liner that prints OK only if a file exists.

### 2.5 man, --help, apropos, and self-service documentation  _(1-2 hrs)_
**Learn:** man pages are organized in numbered sections (1=user commands, 5=file formats/config, 8=admin commands). Learning to navigate man (search with /, jump sections) makes you independent. This is THE skill that separates engineers from copy-pasters.

**📚 Materials:**
- man man
- man hier   (the filesystem-layout man page — bonus, reused in topic 3)
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Working with Commands' (covers man, info, apropos) (linuxcommand.org/tlcl.php)

**🔧 Hands-on:**
- man ls   (navigate: /pattern to search, n for next match, q to quit)
- man 5 crontab vs man 1 crontab  (same name, different sections)
- apropos network   (find commands by keyword)
- man -k permission

**✅ Self-check:**
- What's the difference between 'man 1 passwd' and 'man 5 passwd'?
- How do you search within a man page for the word 'recursive'?

## 3. The Filesystem Hierarchy (where everything on a host lives)
*Why it matters:* On a hypervisor you'll constantly navigate /etc (configs for libvirt/ssh), /var/log (every clue lives here), /var/lib/libvirt (VM disk images and definitions), and /proc & /sys (the kernel's live view of CPU/memory — exactly what you check for KVM capacity). Knowing the map means you find the qemu disk or the OOM log in seconds.

### 3.1 The Filesystem Hierarchy Standard (FHS) big picture  _(2 hrs)_
**Learn:** Linux puts things in predictable places: /etc=config, /var=variable data (logs, spool), /usr=programs, /home=users, /proc & /sys=kernel interfaces, /dev=devices. This map is consistent across the RHEL family, so what you learn on Rocky 9 maps onto your CentOS 7 hosts.

**📚 Materials:**
- man hier   (the canonical filesystem description — read it twice)
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Navigation' and 'Exploring the System' (linuxcommand.org/tlcl.php)
- Filesystem Hierarchy Standard (FHS) 3.0 specification (refspecs.linuxfoundation.org/fhs.shtml) — reference, skim

**🔧 Hands-on:**
- ls -l /    (tour the top-level directories)
- ls /etc | head; ls /var; ls /usr
- du -sh /var/log  (how much space logs use)

**✅ Self-check:**
- In one sentence each: what lives in /etc, /var/log, and /proc?
- If two hosts are both RHEL-family, will libvirt's config be in the same path? Why?

### 3.2 /etc — configuration central  _(2 hrs)_
**Learn:** /etc holds host-wide config in plain text: /etc/ssh/sshd_config, /etc/fstab, /etc/sysconfig, /etc/libvirt/. Editing here changes host behavior. You'll back these up before every change.

**📚 Materials:**
- man hier (the /etc section)
- RHEL 9 'Configuring basic system settings' (docs.redhat.com) — references many /etc files
- man fstab; man sshd_config; man resolv.conf

**🔧 Hands-on:**
- ls /etc/ssh/  and  less /etc/ssh/sshd_config
- cat /etc/fstab  (how filesystems are mounted at boot)
- cat /etc/hostname; cat /etc/hosts

**✅ Self-check:**
- Where does SSH server configuration live, and what file format is it?
- Why do good engineers copy a file to file.bak (or commit it to Git) before editing it in /etc?

### 3.3 /var/log — the evidence locker  _(2 hrs)_
**Learn:** Logs are how you debug. /var/log/messages (general), /var/log/secure (auth/ssh); on EL9 most service logging flows through journald (covered in topic 7). For a hypervisor: per-VM logs live at /var/log/libvirt/qemu/<vm>.log. When a customer VM won't boot, this file is your first stop.

**📚 Materials:**
- man hier (/var/log section)
- RHEL 9 'Configuring basic system settings' — logging chapter, plus the journal chapter (docs.redhat.com)
- libvirt documentation: 'Turning on debug logs' / logging (libvirt.org/kbase/debuglogs.html)

**🔧 Hands-on:**
- sudo ls -l /var/log/
- sudo tail -n 50 /var/log/secure  (recent auth events — see your own SSH logins)
- sudo tail -f /var/log/messages   (watch live, Ctrl-C to stop)
- Later with libvirt: sudo ls /var/log/libvirt/qemu/ ; sudo less /var/log/libvirt/qemu/<vm>.log

**✅ Self-check:**
- A customer reports their VM failed to start. Which file/directory holds the per-VM (qemu) log?
- Which log records SSH login attempts on a RHEL-family host?

### 3.4 /var/lib/libvirt — where customer VMs physically live  _(2-3 hrs)_
**Learn:** This is the heart of your role. /var/lib/libvirt/images holds VM disk images (qcow2/raw); /etc/libvirt/qemu holds the XML domain definitions. The mental model 'a VM = an XML definition + a disk file/volume + a running qemu process' demystifies the whole stack and ties straight to the flavor/Cinder work later. (Note: in production OpenStack, instance disks often live under /var/lib/nova/instances and/or on Cinder-backed volumes rather than the bare libvirt default pool — but the file-plus-process model is identical.)

**📚 Materials:**
- libvirt 'Storage Management' documentation (libvirt.org/storage.html)
- RHEL 9 'Configuring and managing virtualization' — storage pools chapter (docs.redhat.com)
- man hier (/var/lib section); man qemu-img

**🔧 Hands-on:**
- On a libvirt-enabled lab host: sudo ls -lh /var/lib/libvirt/images/
- sudo ls /etc/libvirt/qemu/   (the .xml domain definitions)
- qemu-img info /var/lib/libvirt/images/<some>.qcow2  (note virtual size vs actual disk size — qcow2 is thin/sparse)

**✅ Self-check:**
- What three artifacts together make up one running VM on a host?
- Where on disk would you find a libvirt-managed VM disk image by default, and what format is common? Why might virtual size differ from on-disk size?

### 3.5 /proc and /sys — the kernel's live dashboard (and KVM capacity)  _(3 hrs)_
**Learn:** /proc and /sys are virtual filesystems exposing live kernel state as files: /proc/cpuinfo, /proc/meminfo, /proc/<pid>/, /sys/devices. This is literally how you check KVM capacity (physical cores, memory, and crucially the hardware-virtualization CPU flag) for a new plan. Tools like top just read these.

**📚 Materials:**
- man proc   (long but authoritative)
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Exploring the System' (linuxcommand.org/tlcl.php)
- RHEL 9 'Monitoring and managing system status and performance' (docs.redhat.com)

**🔧 Hands-on:**
- grep -E 'model name|processor' /proc/cpuinfo
- grep -E 'vmx|svm' /proc/cpuinfo   (Intel VT-x = vmx / AMD-V = svm — confirms hardware virtualization; without it KVM acceleration is unavailable)
- head /proc/meminfo
- ls /proc/1/   (PID 1 = systemd's live state)
- nproc  and  free -h ; also: ls /sys/module/kvm* (kvm/kvm_intel/kvm_amd modules loaded?)

**✅ Self-check:**
- Which /proc file (and which flag in it) tells you whether a host's CPU supports hardware virtualization for KVM?
- Why are /proc and /sys called 'virtual' filesystems?
- If the vmx/svm flag is present but KVM isn't accelerating, what's a common cause? (hint: virtualization disabled in BIOS/firmware, or running nested without nested-virt enabled)

### 3.6 Inspecting files: ls, stat, file  _(2 hrs)_
**Learn:** ls -l decodes permissions/owner/size/time; stat gives exact metadata and inode; file identifies content type regardless of extension (a .qcow2 is really 'QEMU QCOW2 Image' data). Reading this metadata is constant when auditing a host.

**📚 Materials:**
- man ls; man stat; man file
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Exploring the System' (linuxcommand.org/tlcl.php)

**🔧 Hands-on:**
- ls -lh /etc/ssh/   (decode each column out loud)
- stat /etc/hostname   (note inode, and access/modify/change timestamps)
- file /etc/hostname; file /bin/ls; file <a qcow2 image if available>

**✅ Self-check:**
- What does each of the 10 characters in '-rw-r--r--' mean?
- How can 'file' tell you a disk image's real format even if it's named wrong?

## 4. Files, Links, Text & vi (manipulating a host safely)
*Why it matters:* You'll copy configs, edit them over SSH where vi may be the only editor, and use tail -f to watch a VM log live. cp/mv/rm have no undo on a host — learning their danger zones now prevents a career-defining mistake on a production hypervisor.

### 4.1 cp, mv, rm — and their danger zones  _(2 hrs)_
**Learn:** Copy, move, remove. There is NO trash can: rm is permanent, rm -rf is permanent and recursive, and a stray space ('rm -rf / tmp' instead of 'rm -rf /tmp') is catastrophic. Always quote variables, prefer rm -i while learning, and back up before destructive ops.

**📚 Materials:**
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Manipulating Files and Directories' (linuxcommand.org/tlcl.php)
- man cp; man mv; man rm

**🔧 Hands-on:**
- mkdir ~/lab && cd ~/lab && touch a b c
- cp a a.bak; mv b b2; rm c; ls -l
- cp -r /etc/ssh ~/lab/ssh-backup  (recursive copy of a config dir)
- Deliberately practice rm -i on a throwaway file to see the confirmation prompt
- Read about (do NOT run) why 'rm -rf "$VAR"/' is dangerous when VAR is empty or unset

**✅ Self-check:**
- Why is there no 'undo' for rm, and what habit mitigates the risk?
- What's the danger of an unquoted or empty variable in an rm command?

### 4.2 Hard links vs symbolic links  _(2 hrs)_
**Learn:** A symlink (ln -s) is a pointer to a path; a hard link is another directory entry for the same inode. RHEL uses symlinks heavily (e.g., /usr/bin/yum -> dnf-3, systemd unit aliases). Misunderstanding them causes broken configs after moves.

**📚 Materials:**
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Manipulating Files and Directories' (links section) (linuxcommand.org/tlcl.php)
- man ln; man symlink

**🔧 Hands-on:**
- cd ~/lab; echo hi > real.txt; ln -s real.txt soft.txt; ln real.txt hard.txt
- ls -li real.txt hard.txt soft.txt  (compare inode numbers; note the -> target on the symlink)
- rm real.txt; cat soft.txt (now broken) vs cat hard.txt (still works) — understand why
- ls -l /usr/bin/yum   (see the real-world symlink on EL9)

**✅ Self-check:**
- On Rocky 9, what is /usr/bin/yum and how can you tell?
- If you delete the original file, which survives — the hard link or the symlink, and why?

### 4.3 Viewing text: cat, less, head, tail, and tail -f  _(2 hrs)_
**Learn:** cat dumps a whole file; less pages through large files (logs!); head/tail show the ends; tail -f streams a growing file live — the single most useful command for watching a VM boot or a service log in real time.

**📚 Materials:**
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Exploring the System' (less) and 'Redirection' (linuxcommand.org/tlcl.php)
- man less; man tail; man head

**🔧 Hands-on:**
- less /var/log/messages  (navigate: Space, b, /pattern, G, g, q)
- head -n 20 /etc/services; tail -n 20 /etc/services
- sudo tail -f /var/log/secure  in one terminal, then SSH in from another and watch the live login line appear
- tail -f -n 100 <log>  (last 100 lines then follow)

**✅ Self-check:**
- Why use less instead of cat on a 2 GB log file?
- Which command lets you watch a log update in real time, and how do you stop it?

### 4.4 Searching text: grep (and a taste of pipes)  _(2-3 hrs)_
**Learn:** grep filters lines matching a pattern — finding the one error in 10,000 log lines. Combined with pipes it's how you triage. Basic regex (anchors ^/$, character classes) multiplies its power.

**📚 Materials:**
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Regular Expressions' and 'Text Processing' (linuxcommand.org/tlcl.php)
- man grep

**🔧 Hands-on:**
- grep root /etc/passwd
- grep -i error /var/log/messages | tail
- grep -c ssh /var/log/secure   (count matching lines)
- ps aux | grep [q]emu   (find running VM processes — the [q] trick excludes the grep itself; preview of topic 6)
- grep -rn 'Listen' /etc/ssh/   (recursive, with line numbers)

**✅ Self-check:**
- How do you count, rather than print, the number of matching lines?
- Write a pipeline that shows only running qemu processes.

### 4.5 Editing with vi/vim (survival to competence)  _(3-4 hrs)_
**Learn:** On a minimal host or rescue shell, vi is often the ONLY editor. You must reliably open, navigate, insert, save, and quit (the infamous :wq / :q!) without panic. Modal editing (Normal vs Insert mode) is the one concept to internalize.

**📚 Materials:**
- Run: vimtutor   (the built-in ~30-minute interactive tutorial — do it twice)
- OpenVim interactive tutorial (openvim.com) (verify URL)
- man vim
- The Linux Command Line (Shotts), 5th Internet Ed. — 'A Gentle Introduction to vi' (linuxcommand.org/tlcl.php)

**🔧 Hands-on:**
- vimtutor (complete the full lesson)
- vi ~/lab/test.conf : enter Insert (i), type lines, Esc, save+quit (:wq)
- Practice the panic exit: open a file, change nothing, quit without saving (:q!)
- Edit a copy of sshd_config: change the Port line, save, then diff against the original (diff sshd_config.bak sshd_config)

**✅ Self-check:**
- You're stuck in vi after accidentally typing text — how do you quit WITHOUT saving?
- What is the difference between Normal mode and Insert mode, and how do you switch between them?

## 5. Users, Groups, Permissions & sudo (who can do what)
*Why it matters:* Multi-tenant infra is an exercise in least privilege. You'll create service accounts for automation, set 600 on SSH private keys (sshd refuses loose perms), and grant scoped sudo instead of sharing root. Getting permissions wrong is the most common — and most dangerous — beginner error.

### 5.1 Users, groups, and identity files  _(2-3 hrs)_
**Learn:** Each user has a UID, a primary group (GID), and supplementary groups; defined in /etc/passwd, /etc/group, /etc/shadow. Processes run AS a user — your qemu VMs typically run as the 'qemu' user (per /etc/libvirt/qemu.conf). Understanding identity is the basis of all access control.

**📚 Materials:**
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Permissions' (linuxcommand.org/tlcl.php)
- RHEL 9 'Configuring basic system settings' — 'Managing users and groups' chapter (docs.redhat.com)
- man 5 passwd; man 5 group; man useradd

**🔧 Hands-on:**
- id   (your UID/GID/groups)
- tail /etc/passwd; grep wheel /etc/group
- sudo useradd -m -s /bin/bash svc-deploy; id svc-deploy
- getent passwd qemu   (the system user your VMs run as, if libvirt is installed)

**✅ Self-check:**
- What's the difference between a user's primary group and a supplementary group?
- Which file stores hashed passwords, and why is it readable only by root?

### 5.2 Permission model: rwx, octal, and what x means on directories  _(2-3 hrs)_
**Learn:** Three permission sets (owner/group/other), each rwx. Octal: r=4, w=2, x=1, so 644=rw-r--r--, 755=rwxr-xr-x, 600=rw-------. Crucially, x on a DIRECTORY means 'can traverse/enter it', not 'execute'. This trips up everyone.

**📚 Materials:**
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Permissions' (linuxcommand.org/tlcl.php)
- man chmod (the octal mode explanation)
- Red Hat 'Configuring basic system settings' — file permissions / setting access; DigitalOcean 'Linux Permissions Basics' (verify URL)

**🔧 Hands-on:**
- cd ~/lab; touch f; ls -l f; chmod 600 f; ls -l f; chmod 644 f; ls -l f
- Translate by hand then verify: chmod 750 f; chmod 700 f
- mkdir d; touch d/inside; chmod 600 d; (try ls d and cd d — both fail: no x = no traverse); chmod 700 d (now works)

**✅ Self-check:**
- What is 640 in rwx notation, and who can do what?
- Why can you not 'cd' into a directory that has read but not execute permission?

### 5.3 chmod and chown in practice  _(2 hrs)_
**Learn:** chmod sets permissions (octal or symbolic, e.g. u+x); chown sets owner:group. You'll use these constantly: fixing a config the wrong user can't read, or making a VM image owned by qemu:qemu. Recursive (-R) is powerful and dangerous on the wrong path.

**📚 Materials:**
- man chmod; man chown
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Permissions' (linuxcommand.org/tlcl.php)

**🔧 Hands-on:**
- chmod u+x ~/lab/script.sh   (symbolic: add execute for owner)
- sudo chown svc-deploy:svc-deploy ~/lab/f; ls -l ~/lab/f
- sudo chmod -R 755 ~/lab/ssh-backup  (understand recursion on a SAFE path before ever using -R on a system path)

**✅ Self-check:**
- Symbolic vs octal: write the same change (add execute for owner) both ways.
- Why is 'chmod -R 777' on a system directory a serious security mistake?

### 5.4 SSH key permissions: the 600 / 644 rule  _(2 hrs)_
**Learn:** ssh and sshd REFUSE to use keys/files with loose permissions. Private keys must be 600 (rw-------), public keys 644, ~/.ssh should be 700, authorized_keys 600. 'Permissions are too open' / 'UNPROTECTED PRIVATE KEY FILE' is the #1 SSH-key error you'll hit on hosts.

**📚 Materials:**
- man ssh; man sshd  (the FILES sections spell out required permissions)
- Arch Wiki: 'SSH keys' — permissions section (wiki.archlinux.org) (verify URL)
- DigitalOcean: 'How To Set Up SSH Keys' (verify URL)

**🔧 Hands-on:**
- ssh-keygen -t ed25519 -f ~/lab/testkey -N ''
- ls -l ~/lab/testkey ~/lab/testkey.pub   (note 600 on private vs 644 on public, set by keygen)
- chmod 644 ~/lab/testkey then try ssh -i ~/lab/testkey ... — observe the refusal — then chmod 600 to fix
- chmod 700 ~/.ssh; chmod 600 ~/.ssh/authorized_keys

**✅ Self-check:**
- What permission must a private SSH key have, and what error appears if it's 644?
- What are the correct permissions for ~/.ssh and authorized_keys?

### 5.5 sudo and service accounts (least privilege)  _(3 hrs)_
**Learn:** sudo grants scoped elevation (logged to /var/log/secure and the journal) instead of sharing the root password. The 'wheel' group typically gets sudo on RHEL. Service accounts (non-login users for automation like Ansible) keep human and machine identity separate and auditable. Always edit sudoers via visudo (it syntax-checks before saving).

**📚 Materials:**
- man sudo; man sudoers; man visudo
- RHEL 9 'Configuring basic system settings' — 'Managing sudo access' (docs.redhat.com)
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Permissions' (su and sudo) (linuxcommand.org/tlcl.php)

**🔧 Hands-on:**
- sudo -l   (what am I allowed to run?)
- sudo whoami   (returns root)
- getent group wheel   (who has sudo)
- sudo useradd -r -s /sbin/nologin svc-ansible  (a no-login service account); sudo -u svc-ansible whoami; then try su - svc-ansible (observe it cannot get an interactive login shell)
- View a sudo audit line: sudo grep sudo /var/log/secure | tail

**✅ Self-check:**
- Why is granting scoped sudo preferable to sharing the root password?
- Why does an Ansible service account typically have /sbin/nologin as its shell, and how does that interact with key-based SSH for automation?

## 6. Processes, Signals & Resources (a VM is just a process)
*Why it matters:* The single most important mental model in your job: each customer VM is a qemu process (KVM-accelerated) on the host. You'll find it with ps, watch host load with top/htop, gracefully stop it with SIGTERM vs forcibly with SIGKILL, and check free/df/du to know whether you can fit a new VM plan — the literal 'verify KVM capacity' step.

### 6.1 Processes, PIDs, and ps  _(2-3 hrs)_
**Learn:** A process is a running program with a PID, owner, parent (PPID), and resource usage. ps lists them. On a host, 'ps aux | grep qemu' shows you every VM as a process with its memory and CPU — making the abstract concrete. Each line's -m/-smp args reveal that VM's RAM and vCPU allocation.

**📚 Materials:**
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Processes' (linuxcommand.org/tlcl.php)
- man ps   (study the 'aux' BSD form and the '-ef' UNIX form)

**🔧 Hands-on:**
- ps aux | head   (decode columns: USER, PID, %CPU, %MEM, COMMAND)
- ps -ef | grep sshd
- On a libvirt host: ps aux | grep [q]emu   (each line = one running customer VM; spot the -m memory and -smp vCPU args)
- pstree -p   (parent/child tree; note everything descends from PID 1)

**✅ Self-check:**
- On a hypervisor, what process represents a single running customer VM?
- What do the %CPU and %MEM columns of ps tell you about a VM process, and where do you see its allocated RAM/vCPU?

### 6.2 Live monitoring: top and htop  _(2 hrs)_
**Learn:** top (built-in) and htop (nicer, installable from EPEL) show live CPU, memory, load average, and per-process usage. Load average and memory pressure are your first read on 'is this host overcommitted?' — directly relevant to capacity for a new plan, since CPU and (sometimes) RAM are overcommitted on VPS hosts.

**📚 Materials:**
- man top; man htop
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Processes' (linuxcommand.org/tlcl.php)
- Brendan Gregg — 'Linux Performance' (brendangregg.com/linuxperf.html) and the USE Method (advanced, skim)

**🔧 Hands-on:**
- top   (read load average top-right; press M to sort by memory, P by CPU, q to quit)
- sudo dnf install -y htop; htop   (F6 to sort, F5 for tree view)
- uptime   (the three load-average numbers = 1/5/15-minute averages)
- Note total vs used vs available memory while a VM (or a stress process) runs

**✅ Self-check:**
- What do the three load-average numbers represent, and roughly when is load 'high' relative to core count?
- Which key sorts top by memory usage?

### 6.3 Signals: SIGTERM vs SIGKILL (and graceful shutdown)  _(2 hrs)_
**Learn:** kill sends signals. SIGTERM (15, the default) asks a process to clean up and exit; SIGKILL (9) forces immediate termination with no cleanup and cannot be caught/ignored. For a VM, the correct graceful path is an ACPI shutdown via libvirt (virsh shutdown), which signals the guest OS to power down cleanly; killing the qemu process directly (especially SIGKILL) is like yanking the power cord and risks guest filesystem corruption. Understanding which to use is real operational judgement.

**📚 Materials:**
- man kill; man 7 signal   (the full signal list)
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Processes' (signals section) (linuxcommand.org/tlcl.php)
- libvirt / man virsh (shutdown vs destroy) (libvirt.org)

**🔧 Hands-on:**
- sleep 600 &   (background a process); note its PID with jobs -l or ps
- kill <PID>    (default SIGTERM — it stops)
- sleep 600 & then kill -9 <PID>   (SIGKILL — compare)
- Conceptually: map virsh shutdown -> graceful (ACPI) vs virsh destroy / kill -9 qemu -> abrupt; read why you reach for graceful first on a customer VM

**✅ Self-check:**
- Why prefer a graceful shutdown (virsh shutdown / SIGTERM) over SIGKILL/virsh destroy when stopping a customer VM?
- What is the numeric value of SIGKILL, and why can't a process catch, handle, or ignore it?

### 6.4 Memory and disk: free, df, du (and capacity thinking)  _(2-3 hrs)_
**Learn:** free -h shows RAM (and the key difference between 'free', 'available', and buffers/cache). df -h shows filesystem space; du -sh shows what's consuming a directory. To approve a new VM plan you must answer 'do we have RAM and disk headroom on this host?' — these are the tools. Remember disk images are often thin-provisioned, so df (actual used) and qemu-img info (virtual size) can differ a lot.

**📚 Materials:**
- man free; man df; man du
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Storage Media' (overview) (linuxcommand.org/tlcl.php)
- RHEL 9 'Managing storage devices' and 'Monitoring and managing system status and performance' (docs.redhat.com)

**🔧 Hands-on:**
- free -h   (note 'available' vs 'free' — available accounts for reclaimable cache and is the number that matters)
- df -h   (which filesystem is /var/lib/libvirt on, and how full?)
- sudo du -sh /var/lib/libvirt/images/*  (per-VM-image actual disk consumption)
- df -h /var/lib/libvirt/images   (headroom for a new VM disk) — compare a thin qcow2's du size vs its qemu-img virtual size

**✅ Self-check:**
- In 'free -h', why is 'available' a better measure of usable RAM than 'free'?
- Which command tells you how much disk a specific VM image is ACTUALLY using vs how much the whole filesystem has left — and why can the image's 'virtual size' be much larger?

## 7. systemd & journald (controlling host services)
*Why it matters:* libvirtd (or the modern modular libvirt daemons), sshd, firewalld, chronyd, and the OpenStack/nova-compute agents are all systemd services. You'll start/stop/enable them, read and edit unit files, run daemon-reload after changes, and use journalctl to see exactly why a service failed. This is the daily mechanics of operating a host.

### 7.1 systemctl: start, stop, enable, status  _(2-3 hrs)_
**Learn:** systemctl is the control surface: start/stop (now), enable/disable (at boot), restart, reload, and status (current state + recent log lines). The distinction between 'running now' and 'enabled at boot' causes real outages when missed (service survives until the next reboot, then vanishes). 'enable --now' does both at once.

**📚 Materials:**
- man systemctl
- RHEL 9 'Configuring basic system settings' — 'Managing services with systemd' (docs.redhat.com)
- DigitalOcean: 'Systemd Essentials: Working with Services, Units, and the Journal' (verify URL)

**🔧 Hands-on:**
- systemctl status sshd
- sudo systemctl restart sshd; systemctl is-active sshd; systemctl is-enabled sshd
- sudo systemctl disable --now <a test service> then sudo systemctl enable --now <it> again
- systemctl list-unit-files --type=service --state=enabled | head

**✅ Self-check:**
- A service runs fine now but is gone after reboot — which systemctl action (enable) did you forget?
- What's the difference between 'restart' and 'reload', and when is reload safer?

### 7.2 Unit files: structure and where they live  _(3 hrs)_
**Learn:** Services are defined by unit files: vendor units in /usr/lib/systemd/system, local overrides/additions in /etc/systemd/system (which wins). Sections [Unit]/[Service]/[Install], directives like ExecStart, After=, WantedBy=. You'll read these to understand a service and override them safely via drop-ins.

**📚 Materials:**
- man systemd.unit; man systemd.service
- RHEL 9 'Configuring basic system settings' — creating and modifying systemd unit files (docs.redhat.com)
- systemd.unit / systemd.service upstream man pages (freedesktop.org)

**🔧 Hands-on:**
- systemctl cat sshd   (shows the effective unit file plus any drop-ins)
- less /usr/lib/systemd/system/sshd.service   (identify ExecStart and After=)
- sudo systemctl edit sshd   (creates a drop-in override in /etc/systemd/system/sshd.service.d/) — add a harmless comment, save
- systemctl show sshd | head   (all resolved properties)

**✅ Self-check:**
- Where do you put a LOCAL override so a vendor unit-file update won't clobber it, and which directory wins?
- What does ExecStart specify, and what does After= control (ordering vs requirement)?

### 7.3 daemon-reload and the change workflow  _(1-2 hrs)_
**Learn:** After editing a unit file by hand, systemd doesn't see it until 'systemctl daemon-reload' (systemctl edit does the reload for you). Forgetting daemon-reload is a classic confusion ('I changed it but nothing happened'). The safe workflow: edit -> daemon-reload -> restart -> status -> journalctl.

**📚 Materials:**
- man systemctl (the daemon-reload section)
- RHEL 9 systemd unit-file management documentation (docs.redhat.com)

**🔧 Hands-on:**
- Hand-edit a test unit's drop-in, then restart WITHOUT daemon-reload and observe the 'Warning: unit changed on disk' message
- sudo systemctl daemon-reload; sudo systemctl restart <service>; systemctl status <service>
- Internalize the sequence as muscle memory on a throwaway service

**✅ Self-check:**
- You hand-edited a unit file and restarted, but the change isn't applied. What step did you skip?
- Write the full safe sequence for applying a unit-file change.

### 7.4 journalctl: reading the systemd journal  _(3 hrs)_
**Learn:** journald centralizes logs. journalctl -u <service> (per service), -f (follow live), -b (this boot), --since/--until (time window), -p err (priority), -k (kernel). This is how you find the root cause when libvirtd or sshd fails to start. Note: by default the journal may be volatile (lost on reboot) unless persistent storage is enabled (/var/log/journal exists).

**📚 Materials:**
- man journalctl
- RHEL 9 'Configuring basic system settings' — 'Viewing logs using the journal' (docs.redhat.com)
- Arch Wiki: 'systemd/Journal' (wiki.archlinux.org) (verify URL)

**🔧 Hands-on:**
- journalctl -u sshd --no-pager | tail -n 30
- sudo journalctl -f   (live tail of the whole system — watch a restart appear)
- journalctl -b   (logs since last boot)  and  journalctl -b -1 (previous boot, only if persistent journaling is enabled)
- journalctl -p err -b   (only errors this boot)
- journalctl --since '10 min ago'

**✅ Self-check:**
- How do you see ONLY the logs for libvirtd, following them live?
- Which flag limits output to the current boot, and which to errors only? Why might 'journalctl -b -1' return nothing on a fresh host?

## 8. Package Management Deep Dive (and why CentOS 7 is a time bomb)
*Why it matters:* You'll add the libvirt/virt repos, trust GPG keys, enable EPEL for tooling, and pin versions so an OpenStack-validated package doesn't surprise-upgrade. And you'll viscerally understand why CentOS 7 being EOL means 'no more security RPMs' — the core driver of your whole modernization mandate.

### 8.1 Repositories: how dnf knows where to get packages  _(2-3 hrs)_
**Learn:** Repos are defined in /etc/yum.repos.d/*.repo with baseurl or mirrorlist/metalink, gpgkey, and enabled flags. Understanding repos explains where packages come from, why a host 'can't find a package' (repo disabled or wrong release), and how to add the virtualization repos you'll need.

**📚 Materials:**
- man dnf.conf; man yum.conf
- RHEL 9 'Managing software with the DNF tool' — 'Configuring DNF and DNF repositories' (docs.redhat.com)
- Rocky Linux documentation: repositories / mirrors (docs.rockylinux.org)

**🔧 Hands-on:**
- ls /etc/yum.repos.d/; less /etc/yum.repos.d/rocky.repo
- dnf repolist   (enabled repos)  and  dnf repolist --all
- sudo dnf config-manager --set-disabled <repo> then --set-enabled <repo>  (dnf config-manager is built in on EL9; on EL8 you may need dnf-plugins-core)

**✅ Self-check:**
- Where are repository definitions stored, and what does the 'enabled=0' line do?
- How do you list every repo, including disabled ones?

### 8.2 GPG keys and package trust  _(1-2 hrs)_
**Learn:** Packages are GPG-signed; dnf verifies each RPM's signature against imported keys (gpgcheck=1) so you don't install tampered or corrupt packages. On infra, package integrity is a real security boundary. You'll import keys when adding repos (e.g., EPEL).

**📚 Materials:**
- RHEL 9 DNF documentation — GPG / package-signature sections (docs.redhat.com)
- man rpm (the --import and -K/--checksig options)
- Fedora EPEL documentation — GPG key import (docs.fedoraproject.org/en-US/epel) (verify URL)

**🔧 Hands-on:**
- rpm -q gpg-pubkey  (list trusted keys)
- rpm -qi gpg-pubkey-<id>   (inspect a key's identity)
- When installing EPEL below, observe dnf prompting to import the EPEL GPG key and accept it knowingly

**✅ Self-check:**
- What does GPG signature verification protect you from when installing packages?
- How can you list the GPG keys a host currently trusts?

### 8.3 EPEL and extra repositories  _(1-2 hrs)_
**Learn:** EPEL (Extra Packages for Enterprise Linux), maintained by the Fedora Project, provides community packages not in base RHEL/Rocky (htop and many tools). You'll enable it deliberately and understand the trade-off: more software, but an additional trust source and a less-stable update cadence than base.

**📚 Materials:**
- Fedora EPEL documentation: 'Quickstart' / 'Using EPEL' (docs.fedoraproject.org/en-US/epel)
- Rocky/Alma documentation on enabling EPEL (docs.rockylinux.org / wiki.almalinux.org)

**🔧 Hands-on:**
- sudo dnf install -y epel-release   (on Rocky/Alma 9)
- dnf repolist | grep epel
- sudo dnf install -y htop   (htop ships from EPEL on EL9)
- Compare: on CentOS 7 EPEL still installs, but its packages are now frozen/unmaintained alongside the EOL base

**✅ Self-check:**
- What is EPEL, who maintains it, and why isn't it enabled by default?
- What's the trust/stability trade-off of adding a third-party repo to a production host?

### 8.4 Version pinning and update discipline  _(2-3 hrs)_
**Learn:** Sometimes you must hold a package at a version (e.g., a kernel, qemu, or libvirt version your OpenStack release is validated against). The dnf versionlock plugin (or excludes in dnf.conf) does this. Update discipline — knowing what changed and being able to roll back — is core to not breaking a fleet.

**📚 Materials:**
- RHEL 9 DNF documentation — 'Locking software versions' / dnf versionlock plugin (docs.redhat.com)
- man dnf  (the --security, check-update, and history undo/rollback sections)

**🔧 Hands-on:**
- sudo dnf install -y python3-dnf-plugin-versionlock
- sudo dnf versionlock add htop; dnf versionlock list; sudo dnf versionlock delete htop
- dnf check-update --security   (security-only pending updates)
- dnf history; sudo dnf history undo <ID>  (roll back a transaction)

**✅ Self-check:**
- Why might you pin libvirt/qemu to a specific version on a hypervisor host running OpenStack nova-compute?
- How do you roll back the last dnf transaction?

### 8.5 Why CentOS 7 is unpatchable now (the security argument)  _(2 hrs)_
**Learn:** After EOL (2024-06-30), CentOS Linux 7 receives NO new security updates from the project. dnf/yum can still install the old, frozen packages, but newly discovered CVEs go unpatched forever (barring paid third-party extended-support like TuxCare ELS, which is a deliberate, costed exception — not 'free updates'). For a public multi-tenant VPS, running EOL hosts is an accumulating, unbounded security and compliance liability — the business case for modernization in one sentence.

**📚 Materials:**
- Red Hat / CentOS official CentOS 7 EOL communication; CentOS End-of-Life table (wiki.centos.org / endoflife.date/centos) — confirm 2024-06-30 (verify URL)
- Rocky Linux / AlmaLinux migration-motivation pages (docs.rockylinux.org, wiki.almalinux.org)
- (Awareness only) TuxCare 'Extended Lifecycle Support for CentOS 7' as the paid exception (verify URL)

**🔧 Hands-on:**
- On your CentOS 7 lab VM: yum check-update   (note no new security errata appear vs a maintained EL9 box)
- cat /etc/redhat-release; rpm -q centos-release  (confirm it's 7.x)
- Write a 5-line memo to yourself: 'Why we cannot keep CentOS 7 in production' citing the EOL date + no upstream CVE patches + multi-tenant exposure

**✅ Self-check:**
- What exactly stops on a CentOS 7 host after 2024-06-30 — and what still 'works'? What's the only way to keep getting security fixes without migrating?
- Why is an unpatched EOL OS a bigger risk on a multi-tenant VPS than on a personal laptop?

## 9. SSH & Bastion Access (how you reach every host)
*Why it matters:* You'll never touch a hypervisor's physical keyboard — you reach it over SSH, usually through a bastion/jump host into a private management network. Keys, ~/.ssh/config, ProxyJump, and rsync are your daily means of access and file transfer; SSH hardening is your first line of host defense.

### 9.1 SSH fundamentals and key-based auth  _(2-3 hrs)_
**Learn:** SSH gives encrypted remote shells; public-key auth (a keypair) replaces passwords. The PUBLIC key goes on the host (in ~/.ssh/authorized_keys); the PRIVATE key stays with you and never leaves your machine. This is how every automated and human connection to your hosts works.

**📚 Materials:**
- man ssh; man ssh-keygen; man ssh-copy-id; man authorized_keys
- RHEL 9 'Configuring basic system settings' — 'Using secure communications between two systems with OpenSSH' (docs.redhat.com)
- DigitalOcean: 'SSH Essentials' and 'How To Set Up SSH Keys' (verify URL)

**🔧 Hands-on:**
- ssh-keygen -t ed25519 -C 'you@infra'  (generate a real keypair)
- ssh-copy-id user@<lab-host>   (or manually append the .pub to the host's authorized_keys)
- ssh user@<lab-host>   (log in with no password)
- ssh -v user@<lab-host>   (verbose — watch the auth method negotiation)

**✅ Self-check:**
- Which half of the keypair goes on the server, and which never leaves your machine?
- What does ssh-copy-id actually do under the hood?

### 9.2 ~/.ssh/config: aliases, users, keys, options  _(2 hrs)_
**Learn:** Instead of long ssh command lines, define Host blocks (HostName, User, IdentityFile, Port). This makes 'ssh hv01' work and is the foundation for ProxyJump. Essential when you manage many hosts across two independent OpenStack deployments.

**📚 Materials:**
- man ssh_config   (the authoritative reference)
- DigitalOcean: 'How To Configure Custom Connection Options for your SSH Client' (verify URL)

**🔧 Hands-on:**
- Create ~/.ssh/config with a Host block: Host lab / HostName <ip> / User <you> / IdentityFile ~/.ssh/id_ed25519
- chmod 600 ~/.ssh/config
- ssh lab   (connect by alias)
- Add a second host and connect to it by alias

**✅ Self-check:**
- Which directives in a Host block let 'ssh lab' know the IP, username, and key to use?
- What permission should ~/.ssh/config have?

### 9.3 Bastion / jump host with ProxyJump  _(2-3 hrs)_
**Learn:** Hypervisors live on a private management network unreachable from the internet; you reach them through a bastion. ProxyJump (ssh -J, or ProxyJump in ssh_config) transparently tunnels your SSH connection through the jump host — the bastion only forwards the encrypted session; it never sees your private key or plaintext. This is THE access pattern for your infra layer.

**📚 Materials:**
- man ssh (the -J flag); man ssh_config (the ProxyJump directive)
- OpenSSH / Red Hat documentation on jump hosts; Teleport (Gravitational) 'SSH bastion host' explainer (verify URL)

**🔧 Hands-on:**
- ssh -J user@bastion user@private-host   (one-line jump)
- Add to ~/.ssh/config: a 'bastion' Host block, then Host hv01 / HostName <private ip> / ProxyJump bastion
- ssh hv01   (now transparently routed through the bastion)

**✅ Self-check:**
- Why can't you SSH directly to a hypervisor on a private management network, and how does ProxyJump solve it without exposing your key to the bastion?
- Write the ~/.ssh/config that makes 'ssh hv01' jump through your bastion.

### 9.4 Transferring files: scp and rsync  _(2 hrs)_
**Learn:** scp copies files over SSH (simple, but largely deprecated/legacy for scripting); rsync copies efficiently (delta transfer, resumable, --dry-run, preserves perms/owner with -a). You'll move configs, logs, and (carefully) disk images between hosts. rsync --dry-run before a real sync is a safety habit. Note: rsync respects your ssh_config, so ProxyJump works automatically.

**📚 Materials:**
- man scp; man rsync
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Networking' (scp/sftp/rsync) (linuxcommand.org/tlcl.php)
- DigitalOcean: 'How To Use Rsync to Sync Local and Remote Directories' (verify URL)

**🔧 Hands-on:**
- scp ~/lab/test.conf user@lab:/tmp/
- rsync -avz ~/lab/ user@lab:/tmp/lab-copy/   (archive, verbose, compressed)
- rsync -avzn ~/lab/ user@lab:/tmp/lab-copy/   (-n = dry-run; see what WOULD change first)
- rsync through the bastion (uses ssh_config ProxyJump): rsync -av src/ user@hv01:/tmp/   (or -e 'ssh -J bastion')

**✅ Self-check:**
- When would you choose rsync over scp?
- What does rsync's --dry-run (-n) let you verify before committing a transfer?

### 9.5 SSH server hardening  _(3 hrs)_
**Learn:** Harden sshd: disable root login (PermitRootLogin no), disable password auth (PasswordAuthentication no — keys only), optionally change the port, and restart safely. On internet-adjacent infra this is baseline security — but ALWAYS validate with 'sshd -t' and keep a SECOND session open when changing sshd so a typo can't lock you out.

**📚 Materials:**
- man sshd_config
- RHEL 9 'Using secure communications between two systems with OpenSSH' — hardening sections (docs.redhat.com)
- Mozilla OpenSSH security guidelines (infosec.mozilla.org/guidelines/openssh) (verify URL)
- CIS Benchmark for Rocky/Alma/RHEL 9 — SSH server section (named reference; download may require free registration)

**🔧 Hands-on:**
- Back up: sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
- Set PermitRootLogin no and PasswordAuthentication no (key-based only)
- sudo sshd -t   (TEST config syntax BEFORE restarting!)
- Keep your current session open; sudo systemctl restart sshd; then open a NEW session to confirm you can still get in
- Confirm root SSH login is now refused

**✅ Self-check:**
- Why must you run 'sshd -t' AND keep a second session open before restarting sshd after a config change?
- Name two sshd_config hardening settings and what each prevents.

## 10. Troubleshooting Method (a repeatable process under pressure)
*Why it matters:* When a customer VM is down or a host misbehaves, panic and random fixes make things worse. A disciplined method — reproduce, check status, read logs, check resources, form one hypothesis, change one thing — is what makes you reliable. dmesg and OOM detection are the specific host-level skills you'll lean on most.

### 10.1 A repeatable troubleshooting framework  _(2-3 hrs)_
**Learn:** Follow a sequence: (1) reproduce / define the symptom precisely, (2) check service status, (3) read the relevant logs, (4) check resources (CPU/RAM/disk/IO), (5) form ONE hypothesis, (6) change ONE thing and re-test. 'Change one thing at a time' and 'write down what you did' are the meta-skills that prevent making an incident worse.

**📚 Materials:**
- Google SRE Book — 'Effective Troubleshooting' chapter (free online: sre.google/sre-book/effective-troubleshooting)
- Brendan Gregg — 'Linux Performance' and the USE Method (brendangregg.com) — systematic resource checking
- RHEL 9 'Monitoring and managing system status and performance' (docs.redhat.com)

**🔧 Hands-on:**
- Write your own 6-step checklist on a card and keep it at your desk
- Practice on a contrived break: stop sshd from a lab host's console, then walk the steps (status -> journalctl -u sshd -> fix -> verify)
- Document a fake incident in 5 lines: symptom, what you checked, hypothesis, change, result

**✅ Self-check:**
- Why is 'change one thing at a time' essential during an incident?
- List the six steps of your troubleshooting framework from memory.

### 10.2 Status and logs first: systemctl + journalctl + /var/log  _(2 hrs)_
**Learn:** Most issues are diagnosed by 'is the service running?' (systemctl status) plus 'what does its log say?' (journalctl -u / -xe, plus the service's own files in /var/log). Reading an actual stack of error lines beats guessing every time.

**📚 Materials:**
- man systemctl; man journalctl (note the -x explanatory-text flag and -e jump-to-end)
- RHEL 9 journal/logging documentation (docs.redhat.com)

**🔧 Hands-on:**
- Break a service config deliberately (e.g., a typo in a test unit's ExecStart), restart, and use systemctl status + journalctl -xe to read the failure
- journalctl -u <service> --since '15 min ago' -p err
- Cross-check with the service's own log file in /var/log (e.g., /var/log/libvirt/...)

**✅ Self-check:**
- After 'systemctl status foo' shows 'failed', what's your very next command?
- What does the -x flag add to journalctl output, and what does -e do?

### 10.3 Kernel and hardware view: dmesg  _(2 hrs)_
**Learn:** dmesg shows the kernel ring buffer: hardware events, driver messages, disk/IO errors, and — critically — OOM-killer activity. When a VM or process 'just died' with nothing in the app log, dmesg often holds the smoking gun. On EL9 the same kernel messages are also available via journalctl -k.

**📚 Materials:**
- man dmesg
- RHEL 9 documentation on kernel logging / journal kernel messages (docs.redhat.com)
- Red Hat Customer Portal knowledgebase on reading dmesg / OOM (access may require a subscription) (verify URL)

**🔧 Hands-on:**
- sudo dmesg -T | tail -n 40   (-T = human-readable timestamps)
- sudo dmesg -T | grep -i error
- journalctl -k -b   (kernel messages via the journal — equivalent view)

**✅ Self-check:**
- What kind of events does dmesg show that an application's own log won't?
- What does the -T flag do for dmesg output, and what's the journalctl equivalent of dmesg?

### 10.4 The OOM killer and memory pressure  _(2-3 hrs)_
**Learn:** When a host exhausts RAM (and swap), the kernel's OOM-killer terminates a process to keep the system alive — and on a hypervisor that could be a customer's qemu (VM) process. You must recognize OOM signatures in dmesg/journal and connect them to memory-overcommit and capacity decisions for new plans (over-committing RAM is far riskier than over-committing CPU).

**📚 Materials:**
- man dmesg; man proc (the oom_score / oom_score_adj sections)
- kernel.org documentation: 'Out Of Memory Management' and overcommit accounting (docs.kernel.org) (verify URL)
- Brendan Gregg memory-analysis material (brendangregg.com)

**🔧 Hands-on:**
- sudo dmesg -T | grep -iE 'killed process|out of memory|oom-killer'   (look for OOM events)
- cat /proc/sys/vm/overcommit_memory   (understand the overcommit policy: 0=heuristic, 1=always, 2=strict)
- On a THROWAWAY VM only: free -h while running a memory stressor (stress-ng --vm 1 --vm-bytes 90% --timeout 30s) and watch 'available' fall (NEVER on a host with real customer VMs)

**✅ Self-check:**
- On a hypervisor, why is an OOM event especially serious — which process might get killed, and what's the customer impact?
- Where do you look to confirm the OOM-killer fired, and what phrase do you grep for? Why is RAM overcommit riskier than CPU overcommit?

## 11. Bash Basics (automating safely)
*Why it matters:* You'll read Ansible-adjacent shell, write small scripts to check capacity or batch-run checks across hosts, and chain commands with && so one failure stops a risky sequence. Quoting and variable hygiene prevent the catastrophic-rm class of bugs.

### 11.1 Pipes and redirection  _(2 hrs)_
**Learn:** | sends one command's stdout to another's stdin; > overwrites, >> appends, 2> redirects stderr, &> (or >file 2>&1) redirects both. This is how you build diagnostics (ps aux | grep qemu | wc -l) and capture output to files. Confusing > with >> can silently destroy a file.

**📚 Materials:**
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Redirection' (linuxcommand.org/tlcl.php)
- man bash (REDIRECTION section)

**🔧 Hands-on:**
- ps aux | grep [s]sh | wc -l
- echo 'line1' > ~/lab/out.txt; echo 'line2' >> ~/lab/out.txt; cat ~/lab/out.txt
- ls /nonexistent 2> ~/lab/err.txt; cat ~/lab/err.txt   (capture stderr only)
- dnf list --installed > ~/lab/packages.txt   (snapshot for an audit)

**✅ Self-check:**
- What's the difference between > and >>, and which one can silently destroy a file?
- How do you redirect ONLY error output (stderr) to a file?

### 11.2 Chaining: && and || (and exit-code logic)  _(2 hrs)_
**Learn:** cmd1 && cmd2 runs cmd2 only if cmd1 succeeded (exit 0); cmd1 || cmd2 runs cmd2 only on failure. This builds safe sequences — e.g., 'sshd -t && systemctl restart sshd' so you never restart on a broken config.

**📚 Materials:**
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Flow Control: Branching with if' and 'Flow Control: Looping' (linuxcommand.org/tlcl.php)
- man bash (Lists / control operators)

**🔧 Hands-on:**
- sudo sshd -t && echo 'config OK' || echo 'config BROKEN'   (the real-world safety pattern)
- mkdir ~/lab/x && cd ~/lab/x && touch y && ls
- false && echo 'should not print'; true || echo 'should not print'

**✅ Self-check:**
- Write a one-liner that restarts sshd ONLY if 'sshd -t' passes.
- What does 'cmd1 || cmd2' do, and when does cmd2 run?

### 11.3 Command substitution $() and variables/quoting  _(3 hrs)_
**Learn:** $(cmd) captures a command's output into a value; VAR=value sets a variable, $VAR / ${VAR} reads it. Quoting rules: "$VAR" expands but keeps it as ONE word (prevents word-splitting/globbing) vs '$VAR' which is literal. Unquoted or empty variables are the root cause of dangerous rm and word-splitting bugs.

**📚 Materials:**
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Seeing the World as the Shell Sees It' (expansion/quoting) (linuxcommand.org/tlcl.php)
- Greg's Wiki — BashFAQ and 'Quotes' (mywiki.wooledge.org) — the canonical quoting reference
- ShellCheck (shellcheck.net) — paste scripts to catch quoting bugs automatically

**🔧 Hands-on:**
- HOST=$(hostname); echo "running on $HOST"
- COUNT=$(ps aux | grep -c [q]emu); echo "$COUNT qemu lines"
- Demonstrate the bug safely: FILE=''; echo "this would target: rm -rf $FILE/"  (see how an empty var expands dangerously — DO NOT run the actual rm)
- Run a small script through shellcheck.net and fix its warnings

**✅ Self-check:**
- Why should you almost always wrap variables in double quotes in a script?
- What does $(date +%F) produce, and how would you use it in a backup filename?

### 11.4 Control flow: if, for, and test  _(3 hrs)_
**Learn:** if/then/fi branches on exit codes or [ tests ]; for loops iterate over lists (hosts, files). This lets you run the same check across many hosts or images — the seed of real automation before Ansible. (Once you outgrow a for-loop over hosts, that's exactly the moment to move to Ansible, in a later phase.)

**📚 Materials:**
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Flow Control: Branching with if', 'Reading Keyboard Input', and 'Flow Control: Looping with while/until' / 'for' (linuxcommand.org/tlcl.php)
- man bash (Compound Commands); man test

**🔧 Hands-on:**
- if [ -f /etc/ssh/sshd_config ]; then echo present; else echo missing; fi
- for h in host1 host2 host3; do echo "would check $h"; done
- for f in ~/lab/*; do stat -c '%n %s bytes' "$f"; done
- Write a loop that runs 'uptime' over SSH on a list of lab hosts: for h in lab1 lab2; do ssh "$h" uptime; done

**✅ Self-check:**
- Write a for-loop that prints the size of every file in a directory.
- What does '[ -f path ]' test, and how does if use its result (exit code)?

### 11.5 Shebangs and writing a real script  _(3-4 hrs)_
**Learn:** A script starts with #!/usr/bin/env bash (the shebang), must be executable (chmod +x), and benefits from 'set -euo pipefail' for safety (exit on error, error on undefined variable, fail a pipeline if any stage fails). This is how you package a capacity-check or audit into a reusable, version-controlled tool.

**📚 Materials:**
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Writing Your First Script' (linuxcommand.org/tlcl.php)
- Greg's Wiki — BashGuide (mywiki.wooledge.org/BashGuide)
- ShellCheck (shellcheck.net) — run every script through it

**🔧 Hands-on:**
- Write ~/lab/capacity.sh: shebang + set -euo pipefail; print hostname, nproc, free -h, df -h /var/lib/libvirt, and the vmx/svm virtualization flag
- chmod +x ~/lab/capacity.sh; ./capacity.sh
- Run it through shellcheck and fix every finding
- Extend it to loop over a host list via SSH and collect each host's capacity

**✅ Self-check:**
- What does the shebang line do, and why prefer '#!/usr/bin/env bash' over a hard-coded path?
- What does each of 'set -e', 'set -u', and 'set -o pipefail' protect you from?

## 12. Git Basics (light) — versioning your changes
*Why it matters:* Your infra configs, scripts, and (later) Ansible playbooks live in Git. Even at this stage, tracking your lab scripts and config backups in Git builds the habit of versioned, reviewable change — the opposite of editing prod by hand with no history. (Note: Git is version history, NOT a backup — a remote you can lose is not the same as an off-site backup of customer data; that distinction matters once real systems are involved.)

### 12.1 init, add, commit — the core loop  _(2-3 hrs)_
**Learn:** git init starts a repo; git add stages changes into the index; git commit records a snapshot with a message. git status and git log show state and history. This is the minimum to never lose work and to know what changed and when.

**📚 Materials:**
- Pro Git (free book), Ch.2 'Git Basics' (git-scm.com/book)
- man git; man git-commit
- GitHub 'Git Cheat Sheet' (training.github.com / education.github.com) (verify URL)

**🔧 Hands-on:**
- cd ~/lab; git init; git status
- git add capacity.sh; git commit -m 'Add capacity check script'
- Edit the script, then git diff, git add, git commit -m 'Add disk headroom check'
- git log --oneline

**✅ Self-check:**
- What's the difference between the working tree, the staging area (index), and a commit?
- Which command shows what you've changed but not yet staged?

### 12.2 Branches (light) and why they matter  _(1-2 hrs)_
**Learn:** A branch is an independent line of work; you make changes on a branch and merge when ready, keeping main stable. Even solo, branching per change is good hygiene and mirrors how you'll later propose infra changes for peer review (pull requests).

**📚 Materials:**
- Pro Git (free book), Ch.3 'Git Branching' — 'Branches in a Nutshell' (git-scm.com/book)
- man git-branch; man git-switch

**🔧 Hands-on:**
- git switch -c try-new-check   (create + switch to a branch)
- Make a change, commit it on the branch, then git log --oneline --all
- git switch main; git merge try-new-check
- git branch -d try-new-check

**✅ Self-check:**
- Why work on a branch instead of committing every change directly to main?
- How do you create a new branch and switch to it in one command?

## 13. OS Networking Baseline (the host's view of the network)
*Why it matters:* Every VM's traffic flows through host networking: bridges (virbr0 for libvirt's NAT network; or Linux/OVS bridges that OpenStack Neutron builds), routes, and firewalld rules. When a customer 'can't reach their VM', you debug at this layer with ip, ss, ping, traceroute, and dig. This is also the on-ramp to the OpenStack/Neutron networking you'll meet in later phases.

### 13.1 Interfaces, addresses, and routes: the ip command  _(2-3 hrs)_
**Learn:** The modern iproute2 'ip' suite replaces ifconfig/route: ip addr (interfaces/IPs), ip route (routing table), ip neigh (ARP/neighbor table). You read these to confirm a host's connectivity and to see which bridge a VM's virtual NIC (a vnetN tap device) attaches to.

**📚 Materials:**
- man ip; man ip-address; man ip-route
- RHEL 9 'Configuring and managing networking' (docs.redhat.com) — the canonical guide
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Networking' (linuxcommand.org/tlcl.php)

**🔧 Hands-on:**
- ip addr show   (find the host's IPs and interfaces; spot vnetN tap devices on a libvirt host)
- ip route show   (default gateway and routes)
- ip neigh show   (ARP/neighbor table — who the host has talked to on the LAN)
- ip -br addr   (brief, readable view)

**✅ Self-check:**
- Which 'ip' subcommand shows the default gateway, and how do you recognize the default route in the output?
- What replaced the old ifconfig/route commands, and why prefer iproute2's tools?

### 13.2 Listening ports and sockets: ss -tlnp  _(2 hrs)_
**Learn:** ss shows sockets: ss -tlnp lists TCP (t) sockets in LISTEN state (l), numerically (n, no name resolution), with the owning process (p). This answers 'is sshd actually listening on 22?' and 'what's bound to this port?' — constant during service debugging.

**📚 Materials:**
- man ss
- RHEL 9 'Configuring and managing networking' (docs.redhat.com) — verifying listening services
- Julia Evans — networking zines/blog (jvns.ca) — accessible explainers (verify URL)

**🔧 Hands-on:**
- sudo ss -tlnp   (every listening TCP port + owning process)
- sudo ss -tlnp | grep :22   (confirm sshd is listening)
- sudo ss -tunap | head   (TCP+UDP, all states, with processes)

**✅ Self-check:**
- What does each letter in 'ss -tlnp' mean?
- How do you confirm which process is listening on port 22?

### 13.3 Reachability and path: ping and traceroute  _(2 hrs)_
**Learn:** ping tests basic IP reachability and latency (ICMP); traceroute shows the hop-by-hop path and where it breaks. These are first tools when 'the host/VM is unreachable' — they help localize the fault to the host, the local network, or beyond. (Caveat: many firewalls drop ICMP/probe packets, so a non-responding hop isn't always 'broken'.)

**📚 Materials:**
- man ping; man traceroute
- The Linux Command Line (Shotts), 5th Internet Ed. — 'Networking' (linuxcommand.org/tlcl.php)

**🔧 Hands-on:**
- ping -c 4 8.8.8.8   (raw IP — is basic network/routing up?)
- ping -c 4 google.com   (does DNS resolution + network both work?)
- traceroute 8.8.8.8   (or tracepath 8.8.8.8 if traceroute isn't installed)
- Compare pinging an IP vs a name to isolate DNS from raw connectivity

**✅ Self-check:**
- If 'ping 8.8.8.8' works but 'ping google.com' fails, what's the most likely problem?
- What does traceroute reveal that ping does not, and why might a middle hop show '*' without anything being wrong?

### 13.4 DNS resolution: dig and resolv.conf  _(2 hrs)_
**Learn:** dig queries DNS directly (A, MX, NS records) and shows which server answered; /etc/resolv.conf lists the resolvers the host uses (note: on EL9 this is often managed by NetworkManager/systemd-resolved, so edit via the right tool, not by hand). DNS misconfiguration is a top cause of 'works by IP, fails by name'.

**📚 Materials:**
- man dig; man resolv.conf
- RHEL 9 'Configuring and managing networking' — DNS / name resolution (docs.redhat.com)
- DigitalOcean: 'An Introduction to DNS Terminology, Components, and Concepts' (verify URL)

**🔧 Hands-on:**
- cat /etc/resolv.conf   (which nameservers does this host use?)
- dig google.com   (full answer + which server responded)
- dig +short google.com   (just the address)
- dig @8.8.8.8 google.com   (query a SPECIFIC resolver to compare against the host's default)

**✅ Self-check:**
- Which file lists the DNS servers a host uses, and what often manages that file on EL9?
- How do you query a SPECIFIC DNS server with dig, and why would you?

### 13.5 Host firewall: firewalld basics (and the nftables backend)  _(2-3 hrs)_
**Learn:** firewalld (default on the RHEL family) manages the host firewall via zones and services. You'll list rules, open/close ports, and reload. Key fact: on EL8/EL9 firewalld's DEFAULT backend is nftables (set by FirewallBackend in /etc/firewalld/firewalld.conf), NOT the legacy iptables it used on EL7 — so 'iptables -L' on a modern host won't show firewalld's real ruleset; use 'nft list ruleset' and firewall-cmd instead. Misconfigured firewalls cause many 'mysterious' connection failures.

**📚 Materials:**
- man firewall-cmd; man firewalld.conf
- RHEL 9 'Configuring firewalls and packet filters' — 'Using and configuring firewalld' and the nftables chapter (docs.redhat.com)
- firewalld.org blog: 'nftables backend' (firewalld.org/2018/07/nftables-backend)

**🔧 Hands-on:**
- sudo firewall-cmd --state; sudo firewall-cmd --get-active-zones
- sudo firewall-cmd --list-all   (rules in the active zone)
- sudo firewall-cmd --add-service=http   (runtime) then --add-service=http --permanent then --reload
- grep FirewallBackend /etc/firewalld/firewalld.conf; sudo nft list ruleset | head   (see the actual nftables rules firewalld generated)
- sudo firewall-cmd --add-port=8080/tcp --permanent; sudo firewall-cmd --reload; sudo firewall-cmd --list-ports

**✅ Self-check:**
- What's the difference between a runtime and a --permanent firewalld rule, and why does --reload matter?
- On a Rocky 9 host, which backend does firewalld use by default, and why won't 'iptables -L' show you its real ruleset?

### 13.6 Virtual networking and virbr0 (libvirt's NAT bridge)  _(3 hrs)_
**Learn:** libvirt's DEFAULT network creates virbr0, a NAT bridge giving VMs a private subnet (typically 192.168.122.0/24) with built-in DHCP/DNS (dnsmasq) and outbound NAT (masquerade) via the host's IP. Understanding bridges, NAT, and how a VM's virtual NIC (a vnetN tap) attaches to the host bridge is your on-ramp to OpenStack Neutron later. Important distinction to carry forward: this NAT/'private' model is conceptually like Neutron's per-tenant/self-service networks reaching out via SNAT; a customer reaching IN to their VM uses either a floating IP (a separately-allocated public IP NATed to the VM) or a VM placed directly on a routable provider network — these are different mechanisms, and confusing 'NAT outbound' with 'reachable inbound' is a classic beginner error.

**📚 Materials:**
- libvirt 'Networking' documentation (wiki.libvirt.org/Networking and libvirt.org/formatnetwork.html)
- RHEL 9 'Configuring and managing virtualization' — virtual networking chapter (docs.redhat.com)
- man virsh (the net-* subcommands)

**🔧 Hands-on:**
- ip addr show virbr0   (the bridge and its subnet, typically 192.168.122.1/24)
- sudo virsh net-list --all; sudo virsh net-dumpxml default   (the default NAT network definition — note <forward mode='nat'/> and the dhcp range)
- ip route show | grep virbr0; sudo nft list ruleset | grep -i masquerade   (see the outbound NAT rule)
- Reason about it: a VM on virbr0 can reach the internet (SNAT via host) but is NOT reachable from outside unless you add port-forwarding/DNAT — the analogue of a floating IP

**✅ Self-check:**
- What is virbr0, and what four things (subnet, DHCP, DNS, NAT) does libvirt's default network provide?
- A VM on the 192.168.122.0/24 NAT network can browse the internet but a customer can't SSH IN to it. Why — and what is the OpenStack analogue of the fix (floating IP vs provider network)?

## 14. CentOS 7 EOL Landscape & Migration Paths (your modernization mandate, in detail)
*Why it matters:* This is the topic that turns Phase 1 from 'generic Linux' into 'your job'. You must be able to explain, to your team, exactly why CentOS 7 must go, which migration tool fits which situation, and why there is NO single-step path from EL7 to EL9 — so your modernization plan is technically correct from day one.

### 14.1 What 'End of Life' means and the 2024-06-30 date  _(1-2 hrs)_
**Learn:** CentOS Linux 7 reached End of Life on 2024-06-30: upstream maintenance, including security errata (CVE fixes), stopped. Hosts keep running but accumulate unpatched vulnerabilities. For a public VPS provider this is an escalating compliance and security problem, not a someday-nice-to-have. (Paid third-party Extended Lifecycle Support exists but is a costed exception, not a reason to delay.)

**📚 Materials:**
- CentOS / Red Hat official CentOS 7 EOL communication; CentOS End-of-Life dates (wiki.centos.org and endoflife.date/centos) — confirm 2024-06-30 against both (verify URL)
- Red Hat guidance on CentOS Linux EOL and migration options (verify URL)

**🔧 Hands-on:**
- On the CentOS 7 lab VM: cat /etc/redhat-release; rpm -q centos-release
- yum check-update   (note the absence of NEW security errata vs a maintained EL9 box)
- Draft a 1-paragraph risk statement for your manager citing the 2024-06-30 EOL date and multi-tenant exposure

**✅ Self-check:**
- What is the CentOS 7 EOL date, and what specifically stopped on that date?
- Why is EOL a security problem rather than merely a support inconvenience, and what's the only way to keep getting fixes short of migrating?

### 14.2 Why EL7 cannot jump straight to EL9 (the multi-hop reality)  _(2-3 hrs)_
**Learn:** Major-version gaps are too large to upgrade EL7 directly to EL9 in place: glibc and toolchain versions, the RPM database format (Berkeley DB on EL7 -> sqlite on EL8/9), SELinux policy, init/cgroup changes, and repo layout all change across each major. The supported in-place path is EL7 -> EL8 (via Leapp/ELevate), and only THEN EL8 -> EL9 — two separate hops, each with its own pre-upgrade report. In practice, for hypervisors a clean reinstall onto EL9 is often safer and is frequently recommended.

**📚 Materials:**
- AlmaLinux ELevate documentation (almalinux.org/elevate) — supported source/target table (EL7->EL8, EL8->EL9)
- Red Hat: 'Upgrading from RHEL 7 to RHEL 8' (Leapp) and 'Upgrading from RHEL 8 to RHEL 9' — note these are TWO SEPARATE major-version documents/hops (docs.redhat.com)
- Cross-check guides (phoenixNAP / Tecmint) on the multi-hop point (verify URL)

**🔧 Hands-on:**
- Draw the decision tree: EL7 --(Leapp/ELevate)--> EL8 --(Leapp/ELevate)--> EL9, with 'fresh reinstall onto EL9' as a parallel branch
- Read the ELevate 'supported upgrade paths' table and write down each allowed hop
- For YOUR hosts, list pros/cons of multi-hop in-place vs reinstall (downtime, risk, VM evacuation, Ansible automation)

**✅ Self-check:**
- Name three concrete things that change between EL7 and EL9 that make a single-step in-place upgrade unsupported.
- What are the two supported in-place hops to get from EL7 to EL9, and what's the main alternative for a hypervisor?

### 14.3 Within-major conversion tools: migrate2rocky and almalinux-deploy  _(2-3 hrs)_
**Learn:** migrate2rocky (Rocky) and almalinux-deploy (AlmaLinux) convert a host to Rocky/Alma WITHIN THE SAME major version — e.g., CentOS 8 -> Rocky 8, or RHEL 9 -> Alma 9. They swap the distro identity/repos and replace release packages; they do NOT bump the major version. Confusing them with ELevate/Leapp (which DO change major version) is the classic beginner mistake.

**📚 Materials:**
- Rocky Linux: 'migrate2rocky' documentation and the migrate2rocky GitHub repo README (docs.rockylinux.org)
- AlmaLinux: 'almalinux-deploy' documentation and GitHub README (wiki.almalinux.org)
- Read each tool's 'supported source distributions' section carefully

**🔧 Hands-on:**
- Read (don't run on anything you care about) the migrate2rocky.sh and almalinux-deploy.sh headers and prerequisites
- In a SNAPSHOTTED throwaway EL8-family VM, optionally rehearse a within-major conversion and revert via the snapshot
- Write one sentence each: when migrate2rocky applies vs when ELevate applies

**✅ Self-check:**
- Does migrate2rocky change a host's major version? What exactly does it change?
- Give one scenario where migrate2rocky is correct and one where it is the WRONG tool.

### 14.4 ELevate / Leapp: the across-major upgrade framework  _(3-4 hrs)_
**Learn:** Leapp is Red Hat's in-place major-upgrade framework; ELevate is AlmaLinux's extension that adds cross-distro data so Leapp can also target Rocky/Alma/Oracle (EL7->EL8, EL8->EL9). Workflow: install leapp + the matching leapp-data, run 'leapp preupgrade' (produces an inhibitor/risk report), resolve the reported blockers, then 'leapp upgrade', then reboot into the upgrade. ALWAYS rehearse on a snapshot first — an interrupted leapp upgrade can leave a host unbootable.

**📚 Materials:**
- AlmaLinux ELevate Quickstart and wiki (almalinux.org/elevate)
- Red Hat: 'Upgrading from RHEL 7 to RHEL 8' — the Leapp preupgrade/upgrade workflow (docs.redhat.com)
- Leapp project documentation (leapp.readthedocs.io / oamg GitHub) (verify URL)

**🔧 Hands-on:**
- On a SNAPSHOTTED throwaway CentOS 7 VM: install elevate-release, then leapp + leapp-data, and run 'leapp preupgrade'; READ the report (you need not complete the upgrade)
- List the inhibitors/blockers leapp reports and map each to a remediation
- If you proceed: 'leapp upgrade', reboot, verify with cat /etc/os-release — then revert via the snapshot to repeat

**✅ Self-check:**
- What does 'leapp preupgrade' produce, and why must you run and clear it before 'leapp upgrade'?
- Which tool moves a host ACROSS a major version, and which only changes the distro WITHIN one major version?

### 14.5 Choosing a path for THIS fleet (in-place vs reinstall + Ansible)  _(3 hrs)_
**Learn:** Synthesize: for a multi-tenant VPS hypervisor fleet, weigh in-place multi-hop upgrades (less data movement, but compounded risk of subtle breakage across two hops, and the host can't host VMs during the upgrade) against a clean reinstall to Rocky/Alma 9 (predictable, fully automatable with Ansible/kickstart, but requires evacuating/live-migrating customer VMs off the host first). For hypervisors the answer is usually reinstall, paired with rigorous capacity and VM-evacuation planning — which connects directly to your new-plan and modernization goals.

**📚 Materials:**
- Red Hat & ELevate upgrade documentation (for the in-place option) (docs.redhat.com, almalinux.org/elevate)
- Rocky/Alma deployment + Kickstart automation documentation (for the reinstall option) (docs.rockylinux.org, wiki.almalinux.org)
- Your later-phase Ansible material (forward reference) — automating reinstall + post-install config
- OpenStack docs on live migration / evacuating compute hosts for maintenance (docs.openstack.org) — relevant to draining a hypervisor (verify URL)

**🔧 Hands-on:**
- Write a 1-page decision memo: for OUR hypervisor hosts, recommend in-place vs reinstall, with reasoning on downtime, VM evacuation/live-migration, risk, and automation
- Sketch the high-level runbook for retiring one CentOS 7 hypervisor: disable scheduling + drain/live-migrate VMs -> reinstall EL9 -> reconfigure libvirt/networking/nova-compute -> validate -> return to the scheduling pool
- Identify which steps you could later automate with Ansible/Kickstart

**✅ Self-check:**
- For a hypervisor hosting LIVE customer VMs, why is reinstall often safer than a two-hop in-place upgrade — and what mandatory step (VM handling) must precede it?
- What are the three biggest risks you'd call out in a CentOS 7 hypervisor-retirement plan to your team?

## 🎯 Phase capstone
Build and document a "Hypervisor Host Readiness Audit" on your own lab. (1) Stand up two throwaway VMs: a Rocky Linux 9 host (your target OS, with libvirt installed and, if your hardware supports nested virtualization, a tiny nested guest) and a CentOS 7 host (the patient). Reach BOTH only over SSH key auth through a (simulated) bastion using a ~/.ssh/config with ProxyJump; harden sshd (PermitRootLogin no, PasswordAuthentication no) AFTER validating with 'sshd -t' and keeping a second session open. (2) Write a Bash script 'host-audit.sh' (shebang + 'set -euo pipefail', passing ShellCheck cleanly, committed to a Git repo with meaningful commits on a feature branch) that for a given host prints: OS/version (/etc/os-release), CPU virtualization support (grep -E 'vmx|svm' /proc/cpuinfo), core/RAM/disk capacity (nproc, free -h, df -h /var/lib/libvirt), running VM/qemu processes (ps), key service states (systemctl is-active sshd libvirtd firewalld), listening ports (ss -tlnp), the libvirt bridge and its NAT subnet (ip addr show virbr0), the firewalld backend (grep FirewallBackend /etc/firewalld/firewalld.conf), SELinux mode (getenforce), and the last 10 errors (journalctl -p err -b). (3) Deliberately break something (stop a service, or fill the /var/lib/libvirt filesystem) on the lab host and walk your written 6-step troubleshooting framework — using systemctl/journalctl/dmesg — to diagnose and fix it, recording the incident in 6 lines (symptom, status, logs, resources, hypothesis, fix+verify). (4) Produce a 1-2 page "CentOS 7 Retirement Recommendation" memo that states the EOL date (2024-06-30) and its security meaning, explains why EL7 cannot jump straight to EL9 (cite at least two concrete cross-major changes, e.g. RPM DB format and glibc/toolchain), correctly distinguishes migrate2rocky / almalinux-deploy (within-major distro swap) from ELevate/Leapp (across-major upgrade, two hops EL7->EL8->EL9), and recommends a path (in-place multi-hop vs reinstall-to-EL9 with VM evacuation) for your hypervisor fleet with reasoning. Success = every command run by YOU (not copied blind), the script green on ShellCheck and version-controlled, the break diagnosed via logs (not guessing), and the memo technically correct on the EOL date and the within-major-vs-across-major distinction.

## 🧰 Primary resources for this phase
- The Linux Command Line by William Shotts — free 5th Internet Edition PDF at linuxcommand.org/tlcl.php (your primary textbook for shell, files, permissions, processes, scripting, and networking)
- Red Hat Enterprise Linux 9 product documentation — docs.redhat.com/en/documentation/red_hat_enterprise_linux/9 (especially 'Configuring basic system settings', 'Using SELinux', 'Managing software with the DNF tool', 'Configuring and managing networking', 'Configuring firewalls and packet filters', and 'Configuring and managing virtualization'; applies near-verbatim to Rocky/Alma 9)
- Rocky Linux documentation (docs.rockylinux.org) and AlmaLinux documentation (wiki.almalinux.org) — your actual target OS, plus the migrate2rocky / almalinux-deploy within-major conversion guides
- AlmaLinux ELevate project (almalinux.org/elevate) + Red Hat Leapp upgrade guides ('Upgrading from RHEL 7 to RHEL 8' and 'Upgrading from RHEL 8 to RHEL 9') on docs.redhat.com — the canonical, correct sources for the across-major EL7->EL8->EL9 upgrade path
- Built-in man pages and 'vimtutor' — your always-available, authoritative on-host reference (man ssh_config, man systemctl, man journalctl, man ip, man ss, man firewall-cmd, man rpm, man dnf, man proc, man hier)
- Pro Git (free, git-scm.com/book) for Git basics, and ShellCheck (shellcheck.net) for every script you write — plus the Google SRE Book 'Effective Troubleshooting' chapter (sre.google/sre-book) for the troubleshooting method

---

# Phase 2 — KVM / libvirt / QEMU (the layer you own)
**Duration:** 7-8 weeks part-time (~10-12 hrs/week)

> This is YOUR layer. Above you sits the Infra API and OpenStack Nova; below you sits the host kernel and physical CPU. Everything Nova does to a customer VM, it does by talking to libvirt, which drives QEMU, which uses the KVM kernel module. So your debugging chain is always Nova -> nova-compute -> libvirt(d)/virsh/XML -> qemu-system process -> kernel/KVM -> hardware, and you must walk it in BOTH directions. (Note: on the compute node, nova-compute is the agent that talks to libvirt; nova-conductor and nova-scheduler run on controllers and handle DB access and host selection, not libvirt calls — keep that boundary straight so you blame the right service.) Treat each topic as: "what does this mean when a Kagoya customer's VM misbehaves at 3am, and where do I look?" Build a tiny throwaway lab in week 1 (one Rocky/AlmaLinux/CentOS-Stream or Ubuntu host, or a nested-virt VM) and keep it running the whole phase — every subtopic has commands you actually type. Tie everything to the two role goals: shipping a new VPS plan (flavor + volume type that resolve down to the vCPU/RAM/disk/virtio decisions in topics 6-8) and migrating off CentOS 7 (which reached EOL 2024-06-30; note EL7 CANNOT in-place jump straight to EL9 — the supported path is 7 -> 8 via Leapp/ELevate, then 8 -> 9, or a clean rebuild on new golden images from topic 9). Two topics deserve obsessive attention because they ARE the VPS business and its biggest outage risk: overcommit (topic 7) and virtio (topic 8). Go slow there.

## 1. What virtualization actually is (VM vs container)
*Why it matters:* Kagoya sells VMs, not containers. You must state precisely what a customer is buying — a full, isolated machine with its own kernel — and why that costs more host resources than a container. This framing decides every capacity and isolation decision downstream.

### 1.1 1.1 The core idea: emulating a whole machine in software  _(2-3 hrs)_
**Learn:** A VM is a software-defined computer: virtual CPU, RAM, disks, NICs presented to a guest OS that believes it owns real hardware. The hypervisor multiplexes one physical machine into many isolated virtual ones. Understand the three classic Popek-Goldberg properties at an intuitive level: equivalence (guest behaves like real hardware), resource control (hypervisor stays in charge), and efficiency (most instructions run directly on the CPU, not emulated).

**📚 Materials:**
- Book: 'Mastering KVM Virtualization' (Packt, 2nd ed., 2020 — Vedran Dakic, Humble Devassy Chirammal, Prasad Mukhedkar, Anil Vettathu) — Ch.1 'Understanding Linux Virtualization'
- Red Hat topic page: 'What is virtualization?' (redhat.com/en/topics/virtualization/what-is-virtualization) (verify URL)
- YouTube: IBM Technology — 'Containers vs VMs: What's the Difference?' (short, clean mental model)

**🔧 Hands-on:**
- On your lab host run: lscpu | grep -i virt (confirm hardware virt: 'VT-x' for Intel, 'AMD-V' for AMD)
- grep -E -c '(vmx|svm)' /proc/cpuinfo (non-zero = CPU supports hardware virtualization; vmx=Intel, svm=AMD)
- lsmod | grep kvm (see kvm plus kvm_intel or kvm_amd loaded)

**✅ Self-check:**
- In one sentence, what does a Kagoya VPS customer get that a shared-hosting customer does not?
- Why does a VM need its own kernel but a container does not?

### 1.2 1.2 Full-kernel (VM) vs shared-kernel (container) — and why it matters to Kagoya  _(2-3 hrs)_
**Learn:** VMs run a separate guest kernel on virtual hardware (strong isolation, higher overhead, any OS including Windows/BSD). Containers share the HOST kernel via namespaces + cgroups (cheap, fast, but same kernel = weaker isolation, and a Linux container needs a Linux host). Kagoya VPS = VMs: customers get root, can load kernel modules, run any distro or Windows, and a kernel panic in one VM cannot touch a neighbour.

**📚 Materials:**
- Red Hat topic page: 'Containers vs VMs' (redhat.com/en/topics/containerization/containers-vs-vms) (verify URL)
- Book: 'Mastering KVM Virtualization' (2nd ed.) Ch.1 (comparison of virtualization types)
- LWN.net: 'Namespaces in operation' article series by Michael Kerrisk (free, canonical for what a container actually is)

**🔧 Hands-on:**
- If a container runtime is present: docker run --rm alpine uname -r then compare to host uname -r (SAME kernel — proves shared kernel)
- Boot any guest VM and inside it run uname -r, compare to host (DIFFERENT kernel — proves full isolation)
- Write a 5-line note: 'Why Kagoya can offer Windows and FreeBSD VPS but not Windows containers on a Linux host'

**✅ Self-check:**
- A customer asks 'can I load a custom kernel module on my VPS?' — yes/no and why?
- Why is a container escape a host-level security event but a VM escape (in theory) much harder?

### 1.3 1.3 Hypervisor taxonomy (Type-1 vs Type-2) — and why KVM breaks the textbook  _(1-2 hrs)_
**Learn:** Classic split: Type-1 (bare-metal, e.g. ESXi, Xen) runs directly on hardware; Type-2 (hosted, e.g. VirtualBox) runs as an app on a normal OS. Learn the definitions so you recognise them in vendor docs, but hold them loosely — KVM doesn't fit cleanly because the Linux kernel IS the hypervisor (covered in topic 2). This subtopic just builds vocabulary.

**📚 Materials:**
- VMware/Broadcom glossary or Red Hat: 'Type 1 vs Type 2 hypervisor' overview (verify URL)
- Book: 'Mastering KVM Virtualization' (2nd ed.) Ch.1 (hypervisor types section)
- Wikipedia: 'Hypervisor' (the Popek-and-Goldberg requirements and Type-1/Type-2 sections are accurate and free)

**🔧 Hands-on:**
- Make a 2-column table: Type-1 examples / Type-2 examples; write where you THINK KVM goes (you will correct this in topic 2)
- Classify ESXi, Xen, Hyper-V, VirtualBox, and QEMU-without-KVM each as Type-1 or Type-2

**✅ Self-check:**
- Define Type-1 and Type-2 in one line each.
- Why is the Type-1/Type-2 label a marketing-grade simplification rather than a rigorous classification?

## 2. Where KVM sits (kernel module turns the host kernel into the hypervisor)
*Why it matters:* When OpenStack Nova reports a 'hypervisor', it means this. Knowing the Linux kernel itself becomes the hypervisor (not a separate product) tells you that a host kernel upgrade, a BIOS virtualization toggle, or a CentOS-7-to-Rocky migration directly changes your hypervisor — central to the modernization goal.

### 2.1 2.1 KVM = a kernel module, not a product  _(2-3 hrs)_
**Learn:** KVM (kvm.ko plus kvm_intel.ko or kvm_amd.ko) is a Linux kernel module that exposes /dev/kvm. Loading it lets the host kernel use the CPU's hardware virtualization (VT-x/AMD-V) to run guest code at near-native speed. There is no separate 'KVM hypervisor binary' — the Linux kernel plus this module is the hypervisor, and QEMU in userspace provides the rest of the machine.

**📚 Materials:**
- Kernel docs: Documentation/virt/kvm/ in the Linux source tree (kernel.org) — start with api.rst overview
- Book: 'Mastering KVM Virtualization' (2nd ed.) Ch.1-2 (KVM architecture)
- Red Hat topic page: 'What is KVM?' (redhat.com/en/topics/virtualization/what-is-KVM) (verify URL)

**🔧 Hands-on:**
- modinfo kvm_intel (or kvm_amd) — read the description and parameters
- ls -l /dev/kvm (the device QEMU opens to get acceleration; note its group/permissions)
- cat /sys/module/kvm_intel/parameters/nested (Y = nested virt enabled — useful so your lab guests can themselves run KVM)

**✅ Self-check:**
- What file does qemu open to get KVM acceleration, and what symptom appears if its permissions are wrong?
- True/false: upgrading the host kernel upgrades your hypervisor. Explain.

### 2.2 2.2 VT-x / AMD-V: the hardware that makes it fast  _(2-3 hrs)_
**Learn:** Hardware virtualization extensions add CPU modes (a guest/non-root mode) so guest privileged instructions trap into the hypervisor instead of being slowly emulated. This is why KVM is fast and why the feature must be enabled in BIOS/UEFI. Understand 'VM exit' conceptually: guest does something privileged -> CPU exits to KVM -> KVM handles it in-kernel or forwards device I/O to QEMU. EPT (Intel) / NPT (AMD) add hardware-assisted nested page tables so memory virtualization is also fast.

**📚 Materials:**
- Book: 'Hardware and Software Support for Virtualization' (Bugnion, Nieh, Tsafrir — Morgan & Claypool Synthesis Lectures, 2017) — CPU virtualization chapter (rigorous; optional, often via university library)
- Intel / AMD vendor pages: search 'Intel VT-x' and 'AMD-V' for the official feature descriptions (verify URL)
- Kernel docs: Documentation/virt/kvm/ (the VM-exit handling model)

**🔧 Hands-on:**
- Reboot lab host into BIOS/UEFI; confirm 'Intel Virtualization Technology' or 'SVM Mode' is Enabled (the #1 'why won't VMs start' root cause)
- cat /proc/cpuinfo | grep -m1 flags | tr ' ' '\n' | grep -E 'vmx|svm|ept|npt' (ept/npt = hardware nested paging for memory)

**✅ Self-check:**
- What must physically be true in BIOS for KVM to accelerate guests?
- In plain words, what happens on a 'VM exit', and roughly how often is that good vs bad for performance?

### 2.3 2.3 Why KVM is a HYBRID (not flatly Type-1)  _(1-2 hrs)_
**Learn:** KVM makes a full Linux OS the hypervisor: it runs a normal kernel with normal userspace processes (Type-2-like) BUT the virtualization happens in-kernel with direct hardware access (Type-1-like). So it is a hybrid. State this precisely — vendors and interviewers disagree, and you should be the person who explains the nuance instead of parroting 'Type-1'.

**📚 Materials:**
- Book: 'Mastering KVM Virtualization' (2nd ed.) Ch.1 (discusses KVM's position relative to Type-1/Type-2)
- Red Hat 'What is KVM?' page (redhat.com/en/topics/virtualization/what-is-KVM) (verify URL)
- Wikipedia: 'Kernel-based Virtual Machine' (accurate on the kernel-module + QEMU-userspace split)

**🔧 Hands-on:**
- Write a 1-paragraph answer to 'Is KVM Type-1 or Type-2?' that a junior understands and a senior accepts
- ps aux | grep qemu on a host with a running guest — note the guest is an ordinary userspace process (the Type-2 flavour) even though CPU acceleration is in-kernel (the Type-1 flavour)

**✅ Self-check:**
- Give the strongest one-sentence argument for 'KVM is Type-1' AND for 'KVM is Type-2', then resolve them.
- Why does the host still run sshd, cron, and your monitoring agent alongside guests?

### 2.4 2.4 virt-host-validate: is this host actually ready to be a hypervisor?  _(1-2 hrs)_
**Learn:** virt-host-validate is the canonical pre-flight check: PASS/WARN/FAIL for hardware virt, /dev/kvm, IOMMU, cgroup controllers, etc. It is your first command when onboarding a new KVM host or when a host 'can't launch VMs'. Learn to read every line and what each FAIL implies for Kagoya capacity.

**📚 Materials:**
- man virt-host-validate (authoritative reference; ships with libvirt-client)
- libvirt.org documentation — host setup / 'validate host virtualization setup' guidance (libvirt.org)
- Book: 'Mastering KVM Virtualization' (2nd ed.) — host setup / validation material

**🔧 Hands-on:**
- Run virt-host-validate qemu on your lab host and read EVERY line
- Map each possible FAIL to a customer-facing symptom (e.g. 'hardware virtualization disabled' -> no VMs start at all on this host)
- Add virt-host-validate to a written host-onboarding checklist

**✅ Self-check:**
- Which virt-host-validate FAIL means 'this host cannot run accelerated VMs at all'?
- Which WARNs are safe to ignore in a lab but matter in production (e.g. IOMMU for device passthrough, cgroup controllers for resource limits)?

## 3. KVM + QEMU + libvirt division of labor (your debug chain)
*Why it matters:* The single most important mental model for your job. Nova never talks to a VM directly — nova-compute talks to libvirt. When a customer VM fails to launch you must know which layer to blame and which log/command to use. Nova -> nova-compute -> libvirtd -> qemu-system -> kernel is your daily map.

### 3.1 3.1 KVM does CPU acceleration, QEMU does the rest of the machine  _(3-4 hrs)_
**Learn:** QEMU is the userspace emulator: it presents virtual devices (disk, NIC, firmware, chipset) and runs the guest. With KVM (-accel kvm) it offloads CPU execution to /dev/kvm for near-native speed and emulates only I/O devices. Without KVM, QEMU emulates the CPU too (slow, software TCG). So: KVM = fast CPU, QEMU = everything else.

**📚 Materials:**
- QEMU official docs: qemu.org/docs/master/ (System Emulation — 'Introduction' and the KVM accelerator page)
- Book: 'Mastering KVM Virtualization' (2nd ed.) Ch.2 (QEMU)
- man qemu-system-x86_64 (skim -accel, -machine, -cpu)

**🔧 Hands-on:**
- Launch a tiny guest by hand: qemu-system-x86_64 -accel kvm -m 512 -nographic -cdrom <some.iso> (feel raw QEMU before libvirt hides it)
- Run the same WITHOUT -accel kvm and observe how much slower boot is (proves what KVM buys you)
- ps -ef | grep qemu-system on a libvirt-managed guest and READ the full command line libvirt generated

**✅ Self-check:**
- With KVM enabled, which parts of the guest does QEMU still emulate?
- Why is there exactly one qemu-system process per running guest?

### 3.2 3.2 One qemu-system process per guest  _(2-3 hrs)_
**Learn:** Each running VM is exactly one qemu-system-x86_64 process on the host. Its vCPUs are threads inside that process; guest RAM is that process's memory. So standard Linux tools (ps, top, kill, cgroups, /proc/<pid>) work on VMs — a superpower for debugging and capacity. Killing that PID is a hard power-off (no clean guest shutdown).

**📚 Materials:**
- QEMU docs: 'System Emulation' overview (process/threading model)
- Book: 'Mastering KVM Virtualization' (2nd ed.) — QEMU process and thread sections
- man qemu-system-x86_64 (-smp / threading behaviour)

**🔧 Hands-on:**
- For a running guest: PID=$(pgrep -f "guest=<name>"); ls /proc/$PID/task (each task = a vCPU or I/O thread)
- cat /proc/$PID/status | grep -E 'VmRSS|Threads' (RSS approximates the guest's current host RAM footprint)
- top -H -p $PID (watch per-vCPU thread CPU usage live)

**✅ Self-check:**
- If a host runs 50 VMs, how many qemu-system processes do you expect, and how do vCPUs appear inside each?
- What host command is equivalent to yanking a VM's power cord, and why is it dangerous to in-flight data?

### 3.3 3.3 libvirt: the management layer (libvirtd/split daemons + virsh + XML)  _(3-4 hrs)_
**Learn:** libvirt is the stable API/toolkit ABOVE qemu. The daemon is libvirtd (or, on newer systems, split modular daemons such as virtqemud); it stores each VM as a 'domain' defined by XML; virsh is the CLI; it generates the giant qemu command line for you. OpenStack Nova's libvirt driver (in nova-compute) talks to this API — so libvirt is the actual seam your Infra API ultimately reaches.

**📚 Materials:**
- libvirt.org official docs: the virsh man page (libvirt.org/manpages/virsh.html) and the Deployment/Applications guides
- libvirt.org: Domain XML format reference (libvirt.org/formatdomain.html)
- Book: 'Mastering KVM Virtualization' (2nd ed.) Ch.3 (libvirt)
- man libvirtd and man virsh

**🔧 Hands-on:**
- systemctl status libvirtd (or virtqemud on split-daemon setups) — know which model your host uses
- virsh version ; virsh nodeinfo ; virsh capabilities | head -40 (what libvirt knows about this host)
- virsh list --all then virsh dumpxml <guest> | less (see the stored XML, then find that XML reflected in the qemu cmdline from 3.2)

**✅ Self-check:**
- Draw the layers Nova -> ? -> ? -> ? -> hardware and name the tool/protocol at each arrow.
- Why does Nova target libvirt's stable API instead of building qemu command lines itself?

### 3.4 3.4 The OpenStack-to-kernel debug chain (apply it to a launch failure)  _(3-4 hrs)_
**Learn:** Internalise failure isolation: a VM won't launch -> is it Nova (scheduling/quota/placement), nova-compute/libvirt (a libvirtError in nova-compute.log), qemu (the process dies / qemu domain log), or kernel/KVM (dmesg, /dev/kvm perms, OOM)? Each layer has a specific log. You walk DOWN to find the failure and UP to explain customer impact. Remember nova-scheduler/placement decides WHICH host; nova-compute on that host does the libvirt call — a 'No valid host' error is a scheduler problem, not a libvirt one.

**📚 Materials:**
- OpenStack docs: Nova libvirt virt-driver reference and Nova logging/troubleshooting pages (docs.openstack.org)
- libvirt.org: per-domain log location /var/log/libvirt/qemu/<guest>.log and daemon logging guidance
- Book: 'Mastering KVM Virtualization' (2nd ed.) — troubleshooting material

**🔧 Hands-on:**
- Map the logs on your host: /var/log/libvirt/ (daemon log), /var/log/libvirt/qemu/<guest>.log, dmesg, and on a compute node /var/log/nova/nova-compute.log
- Force a failure: try to start a guest requesting more RAM than the host has; trace WHERE the error first appears (libvirt log vs qemu log vs dmesg OOM)
- Write the 4-layer triage checklist as a sticky note: Nova/placement? -> nova-compute/libvirt? -> qemu? -> kernel?

**✅ Self-check:**
- A customer VM 'failed to build' in Horizon — name the first log files you open and in what order.
- How do you tell a 'No valid host found' scheduler error apart from a libvirt error apart from a qemu-process-died error?

## 4. Domain XML & virsh (how a VM is defined and driven)
*Why it matters:* Every Kagoya VM is, at the libvirt layer, an XML document. To debug what Nova built (right disk bus? right vCPU count? right virtio NIC?) you read dumpxml. virsh is how you inspect and emergency-operate a customer's VM by hand when the panel/Nova path is broken.

### 4.1 4.1 Anatomy of the domain XML  _(3-4 hrs)_
**Learn:** Read a real domain XML top to bottom: <domain type='kvm'>, <vcpu>, <memory>/<currentMemory>, <os> (firmware/boot), <cpu mode='...'> (model/mode), and <devices> containing <disk> (with <driver> and <target bus='virtio'>), <interface> (with <model type='virtio'>), <graphics>, <serial>/<console>. Know what each block controls and which map to plan/flavor decisions. Note that under Nova the XML is GENERATED from flavor + image properties + nova.conf, so you rarely hand-edit it in prod — you read it to verify what Nova produced.

**📚 Materials:**
- libvirt.org: Domain XML format reference (libvirt.org/formatdomain.html) — bookmark permanently
- Book: 'Mastering KVM Virtualization' (2nd ed.) — domain XML material
- Red Hat 'Configuring and managing virtualization' guide — domain XML / VM configuration (docs.redhat.com) (verify URL/edition)

**🔧 Hands-on:**
- virsh dumpxml <guest> > guest.xml then annotate each top-level element with what it does
- Find the three performance-critical lines: disk bus, interface model, and cpu mode — confirm they read virtio / virtio / host-model (or note if they don't)
- Diff two guests: virsh dumpxml a > a.xml; virsh dumpxml b > b.xml; diff a.xml b.xml

**✅ Self-check:**
- Which XML elements change to implement a 'new VPS plan' with more vCPU and RAM, and which of those are set by the flavor vs the image?
- Where in the XML do you confirm a guest uses virtio disk + net rather than emulated devices?

### 4.2 4.2 Core virsh inspection commands  _(2-3 hrs)_
**Learn:** Fluency in the read-only verbs: virsh list / list --all, dominfo, dumpxml, domstate, dommemstat, vcpuinfo, domblklist, domiflist, nodeinfo, capabilities, domstats. These are safe to run on production and answer 'what is this customer's VM actually doing/configured as?'

**📚 Materials:**
- man virsh (group the verbs by domain monitoring / domain control / node)
- libvirt.org: virsh man page (libvirt.org/manpages/virsh.html)
- YouTube: Learn Linux TV (Jay LaCroix) — KVM/libvirt tutorial series (learnlinux.tv or the YouTube channel) for practical virsh walk-throughs

**🔧 Hands-on:**
- Run on a guest: virsh dominfo <g>; virsh domstate <g>; virsh vcpuinfo <g>; virsh domblklist <g>; virsh domiflist <g>; virsh dommemstat <g>
- virsh domstats <g> and find vcpu time, balloon current, and block I/O stats
- Build a one-liner 'VM health snapshot' that prints state, vCPUs, mem, disks, and NICs for a given guest name

**✅ Self-check:**
- Which single command shows a VM's current state plus configured vs current memory?
- How do you list which host disk image and which tap/NIC a given customer VM is using?

### 4.3 4.3 Lifecycle/control verbs and editing XML safely  _(3-4 hrs)_
**Learn:** Action verbs and their blast radius: start, shutdown (graceful ACPI), reboot, destroy (force off — like pulling the cord), suspend/resume, save/restore, managedsave, virsh edit (validated edit), define/undefine (persist/remove config), autostart, console. Crucially: destroy != delete (powers off, does not erase the disk) and virsh edit on a live guest only takes effect after the next full power cycle, not a reboot.

**📚 Materials:**
- man virsh (sections for each verb)
- libvirt.org: virsh man page and domain lifecycle guidance
- Book: 'Mastering KVM Virtualization' (2nd ed.) — managing guests material

**🔧 Hands-on:**
- On a THROWAWAY lab guest only: virsh shutdown g; virsh start g; virsh destroy g (note it only powers off); virsh start g again
- virsh edit g — change vcpu from 1 to 2; observe libvirt re-validates the XML; verify with virsh dumpxml and confirm it applies only after a full stop/start, not a reboot
- virsh console g (set up a serial console in XML first); practice the Ctrl+] escape
- virsh autostart g; virsh autostart --disable g

**✅ Self-check:**
- Customer says 'my VM is stuck' — when is virsh shutdown right, when must you escalate to virsh destroy, and what is the data risk of each?
- Distinguish virsh destroy vs virsh undefine vs deleting the disk image.

## 5. VM lifecycle & states
*Why it matters:* Your monitoring, the panel, and Nova all expose VM states. You must map libvirt states to what the customer sees and to the correct operator action. 'shutdown vs destroy' and 'persistent vs transient' are exactly the distinctions that cause data-loss incidents when misunderstood.

### 5.1 5.1 The state machine: running / paused / saved / shut off / crashed  _(2-3 hrs)_
**Learn:** libvirt domain states: running, paused (vCPUs frozen, RAM intact, qemu process alive), pmsuspended, shut off (no qemu process), crashed, plus the saved-to-disk concept (managedsave/save writes RAM to a file and the process exits). Know the transitions and what each means for the qemu process.

**📚 Materials:**
- libvirt.org: domain state documentation / virDomainState enum reference
- Book: 'Mastering KVM Virtualization' (2nd ed.) — guest lifecycle material
- man virsh (domstate, and the state words in list output)

**🔧 Hands-on:**
- Drive every transition on a lab guest, checking virsh domstate after each: start -> running; suspend -> paused; resume -> running; save f.sav (shut off, file created) -> restore f.sav (running); shutdown -> shut off
- While paused, confirm the qemu PID still exists (ps); after shutdown confirm the PID is gone
- Draw the full state-transition diagram from your observations

**✅ Self-check:**
- Among paused / saved / shut off, which still consumes host RAM and which still has a live qemu process?
- A VM shows 'crashed' — what does that tell you and what do you check next?

### 5.2 5.2 shutdown vs destroy (the power-cord distinction)  _(2 hrs)_
**Learn:** shutdown = a polite ACPI power-button signal to the guest OS to power down cleanly (needs a cooperating guest with ACPI or the qemu guest agent; can hang or be ignored). destroy = immediate forced power-off of the qemu process — instant, but the guest had no chance to flush filesystems, risking corruption / fsck on next boot. Neither deletes data. This is the most consequential operator choice you make on customer VMs.

**📚 Materials:**
- man virsh (shutdown, destroy, reboot, reset — read the exact wording, including --mode acpi|agent)
- libvirt.org: virsh man page (shutdown vs destroy semantics)
- Red Hat 'Configuring and managing virtualization' — shutting down virtual machines (verify URL)

**🔧 Hands-on:**
- On a lab guest with a shell open inside it: virsh shutdown g, watch the guest power off cleanly
- Reproduce a 'hung' guest, then virsh destroy g; on next boot watch the guest journal-recover / fsck
- Try virsh shutdown on a guest with NO ACPI and no guest agent and watch nothing happen (proves shutdown needs guest cooperation)

**✅ Self-check:**
- Why can virsh shutdown do nothing, and what does that imply about relying on it in automation?
- After virsh destroy, what is the realistic worst case for the customer's filesystem and why?

### 5.3 5.3 Persistent vs transient domains, and autostart  _(2-3 hrs)_
**Learn:** A persistent domain has saved XML (virsh define), survives a host reboot, and appears in list --all even when off. A transient domain exists only while running (virsh create from XML) and vanishes on stop — no stored config. autostart marks a persistent domain to launch on host boot. For Kagoya, customer VMs must be persistent + autostart so a host reboot brings every customer back automatically. (Under Nova, persistence and restart-on-boot are managed by nova-compute, not raw autostart symlinks — but the underlying libvirt concept is the same.)

**📚 Materials:**
- libvirt.org: persistent vs transient domain documentation
- man virsh (define, undefine, create, autostart)
- Book: 'Mastering KVM Virtualization' (2nd ed.) — defining vs creating guests

**🔧 Hands-on:**
- Transient: virsh create transient.xml; virsh list (running); virsh destroy <g>; virsh list --all (GONE — proves transient)
- Persistent: virsh define guest.xml; virsh start g; virsh destroy g; virsh list --all (still listed as shut off)
- virsh autostart g; reboot the lab host; confirm the guest came back on its own
- ls /etc/libvirt/qemu/ and /etc/libvirt/qemu/autostart/ (where persistent XML and autostart symlinks live)

**✅ Self-check:**
- Why would creating customer VMs as transient be a catastrophic operational bug for a VPS provider?
- After virsh undefine on a running persistent VM, what happens now and what happens at the next host reboot?

## 6. vCPU / RAM / disk allocation (what a 'plan' actually allocates)
*Why it matters:* A VPS plan IS a bundle of vCPU + RAM + disk = an OpenStack flavor + Cinder volume type that resolve down to these KVM resources. To ship the new plan (Goal 1) you must understand what each number physically costs the host — and the flavor-definition traps that bite beginners.

### 6.1 6.1 vCPU = a scheduled host thread (time-slicing)  _(2-3 hrs)_
**Learn:** A vCPU is not a dedicated core — it is a thread of the qemu process that the HOST Linux scheduler (CFS) runs on physical cores like any other thread. 4 vCPUs = 4 schedulable threads competing for host pCPU time. This is why you can sell more vCPUs than you have cores (overcommit, topic 7) and why 'steal time' appears under contention. CPU pinning (<cputune>/vcpupin) can dedicate vCPUs to pCPUs for predictable performance, at the cost of packing density.

**📚 Materials:**
- Book: 'Mastering KVM Virtualization' (2nd ed.) — CPU/vCPU material
- libvirt.org: <vcpu>, <cputune>, and CPU tuning / pinning in the Domain XML reference
- Red Hat 'Configuring and managing virtualization' — optimizing virtual machine CPU performance (verify URL/edition)

**🔧 Hands-on:**
- Define a 2-vCPU guest; on host run top -H -p <qemu-pid> and identify the two vCPU threads
- virsh vcpuinfo <g> (vCPU-to-pCPU placement and CPU time per vCPU)
- Run a CPU stress test inside the guest (stress-ng --cpu N) and watch those host threads light up in top -H

**✅ Self-check:**
- Explain to a customer why '4 vCPU' does not guarantee 4 dedicated cores.
- Which host scheduler decides when a guest's vCPU thread actually runs, and what does CPU pinning change?

### 6.2 6.2 Guest RAM = host memory handed to the qemu process  _(2-3 hrs)_
**Learn:** Guest RAM is backed by the qemu process's address space on the host, usually lazily allocated — the host commits a page only when the guest first touches it. So an 8GB guest does not instantly consume 8GB of host RAM, but it CAN grow to it. Understand RSS vs configured memory, hugepages as an option, and that RAM (unlike vCPU) is the resource you overcommit most dangerously.

**📚 Materials:**
- libvirt.org: <memory>, <currentMemory>, <memoryBacking> (hugepages) in the Domain XML reference
- Book: 'Mastering KVM Virtualization' (2nd ed.) — memory material
- Kernel docs: Documentation/admin-guide/mm/ (transparent hugepages, hugetlbpage) for host-memory backing detail

**🔧 Hands-on:**
- Define a 4GB guest, boot it idle, then on host run grep VmRSS /proc/<qemu-pid>/status (RSS << 4GB at idle)
- Inside the guest allocate memory (stress-ng --vm 1 --vm-bytes 3G) and watch host RSS climb toward 4GB
- virsh dommemstat <g> (actual vs available vs unused as reported by the balloon driver)

**✅ Self-check:**
- Why does an idle 4GB guest not use 4GB of host RAM, yet you still cannot ignore that 4GB when planning capacity?
- What is the relationship between configured <memory>, host RSS, and what the customer sees as 'free' inside the guest?

### 6.3 6.3 Disk: qcow2 vs raw, storage pools, and the flavor disk=0 trap  _(3-4 hrs)_
**Learn:** VM disks are files or block devices. raw = a plain byte-for-byte image, fastest, fully allocated unless sparse, no internal snapshots. qcow2 = QEMU Copy-On-Write v2: thin-provisioned, supports internal snapshots and backing files (golden-image chains), with slight overhead. libvirt groups storage into 'pools' (dir, LVM, NFS, Ceph/RBD) holding 'volumes'. Map plan disk type to a Cinder volume type. TRAP for the new plan: an OpenStack flavor with root disk = 0 means 'no Nova-managed root disk size limit' (the instance boots from a Cinder volume whose size sets the real disk) — set disk=0 by accident on an ephemeral-disk plan and customers get an unbounded or zero-sized root disk. Always be explicit.

**📚 Materials:**
- QEMU docs: qemu-img and the qcow2 format documentation (qemu.org/docs)
- libvirt.org: 'Storage management' / storage pools and volumes documentation
- man qemu-img (create, info, convert, snapshot)
- OpenStack docs: Nova 'Flavors' reference (root_gb / ephemeral / swap meaning, including disk=0 semantics) and Cinder volume types (docs.openstack.org)
- Book: 'Mastering KVM Virtualization' (2nd ed.) — storage material

**🔧 Hands-on:**
- qemu-img create -f qcow2 test.qcow2 10G then qemu-img info test.qcow2 (virtual vs actual size — thin provisioning)
- qemu-img create -f raw test.raw 10G ; ls -lh vs du -h (apparent vs real size, raw vs qcow2)
- qemu-img convert -f qcow2 -O raw test.qcow2 test2.raw (the conversion you do in migrations)
- virsh pool-list --all; virsh vol-list default (inspect host storage pools and volumes)
- Read a flavor: openstack flavor show <flavor> and note root/ephemeral/swap sizes; reason about what disk=0 would mean for a boot-from-volume plan

**✅ Self-check:**
- When would you choose raw over qcow2 for a customer plan, and what do you give up?
- How does qcow2 enable golden-image-based provisioning (backing files)? And what does an OpenStack flavor with disk=0 actually mean?

## 7. CPU & memory overcommit (the economic heart and biggest risk)
*Why it matters:* Overcommit is literally how a VPS provider makes money: sell more vCPU/RAM than physically exists, betting customers won't all peak at once. It is also your #1 outage cause — a bad memory-overcommit ratio triggers the OOM/swap death spiral that can take down EVERY VM on a host at once. Spend real time here.

### 7.1 7.1 Overcommit ratios (CPU vs memory) and why they differ  _(3-4 hrs)_
**Learn:** CPU overcommit is relatively forgiving: excess vCPUs just wait (you get latency/steal, not a crash). Memory overcommit is dangerous: if everyone actually uses their RAM, the host runs out and something dies. Learn typical ratios and how OpenStack expresses them — note that in modern Nova these live in Placement as initial_cpu_allocation_ratio / initial_ram_allocation_ratio (per-compute, written into Placement inventory), historically cpu_allocation_ratio / ram_allocation_ratio in nova.conf — and that CPU and RAM must be reasoned about completely differently.

**📚 Materials:**
- OpenStack Nova docs: 'Overcommitting CPU and RAM' and allocation-ratio configuration (docs.openstack.org)
- Red Hat 'Configuring and managing virtualization' / Compute (Nova) overcommit guidance (verify URL/edition)
- Book: 'Mastering KVM Virtualization' (2nd ed.) — overcommit / KSM material

**🔧 Hands-on:**
- On a compute node, find the ratios: grep -E 'cpu_allocation_ratio|ram_allocation_ratio|initial_(cpu|ram)_allocation_ratio' /etc/nova/nova.conf (or note the defaults and check Placement inventory)
- On your lab host, define more total vCPUs across guests than you have pCPUs, stress them all, and observe added latency NOT a crash
- Worked example: host has 256GB RAM, plan is 8GB — at ram ratio 1.5 how many VMs fit, and what is the failure scenario if real usage spikes to near-100%?

**✅ Self-check:**
- Why is CPU overcommit forgiving but memory overcommit potentially fatal to a whole host?
- Which Nova/Placement knobs control how oversold a compute host is, and where do they live in modern Nova?

### 7.2 7.2 KSM (Kernel Same-page Merging) — reclaiming RAM via dedup  _(2-3 hrs)_
**Learn:** KSM is a host kernel daemon (ksmd) that scans guest memory and merges identical pages into one shared copy-on-write page, freeing RAM — valuable when many guests run the same OS image. Trade-offs: CPU cost of scanning, and documented cross-VM side-channel/timing concerns (one reason some clouds disable it on multi-tenant hosts). Know how to check/tune it because it directly affects how many VMs fit per host.

**📚 Materials:**
- Kernel docs: Documentation/admin-guide/mm/ksm.rst (kernel.org — authoritative)
- Red Hat virtualization tuning / KSM documentation (docs.redhat.com) (verify URL)
- Book: 'Mastering KVM Virtualization' (2nd ed.) — KSM material

**🔧 Hands-on:**
- cat /sys/kernel/mm/ksm/run (0/1/2) and stats: pages_shared, pages_sharing, full_scans
- Boot several identical-OS guests, then watch pages_sharing climb (RAM being deduplicated)
- systemctl status ksm ksmtuned (the tuning daemon) and read /etc/ksmtuned.conf

**✅ Self-check:**
- How does KSM let you fit more identical-OS customer VMs on one host?
- What is the CPU/latency cost of KSM and one security concern that argues against it on multi-tenant hosts?

### 7.3 7.3 Memory ballooning (virtio-balloon)  _(2 hrs)_
**Learn:** The balloon driver inside the guest can 'inflate' (return RAM to the host) or 'deflate' (reclaim it) on demand, letting the host rebalance memory between guests. virsh setmem changes the balloon target. It is a soft, COOPERATIVE overcommit tool — it depends on the guest having the virtio-balloon driver loaded (a virtio concern, topic 8) and a cooperating guest that gives memory back. Important caveat: ballooning and KSM interact, and aggressive ballooning can itself push a guest into swap.

**📚 Materials:**
- libvirt.org: <memballoon> device documentation (Domain XML reference)
- Red Hat / QEMU docs: virtio-balloon description
- Book: 'Mastering KVM Virtualization' (2nd ed.) — ballooning material

**🔧 Hands-on:**
- virsh dommemstat <g> (note balloon current); virsh setmem <g> 2G --live (shrink), recheck; then setmem back up
- Inside the guest watch free -m change as you balloon from the host
- Confirm the balloon device: virsh dumpxml <g> | grep -A2 memballoon, and lsmod | grep balloon inside the guest

**✅ Self-check:**
- What must be true inside the guest for ballooning to work at all?
- Why is ballooning 'cooperative', and how can a misbehaving or driver-less guest defeat it?

### 7.4 7.4 Steal time — the symptom of CPU oversubscription  _(2 hrs)_
**Learn:** Steal time (%st in the guest's top/vmstat) is time the guest's vCPU was runnable but the host scheduler gave the physical core to someone else. High steal = the host is CPU-oversold or has a noisy neighbour. It is measured INSIDE the guest but CAUSED by HOST overcommit — a key 'my VPS feels slow' diagnostic.

**📚 Materials:**
- Brendan Gregg — writing on CPU utilization and steal time (brendangregg.com) (verify URL); canonical systems-performance source, also his book 'Systems Performance' (2nd ed.)
- man top and man vmstat (the 'st' column definition)
- Red Hat Customer Portal KB: 'What is CPU steal time?' (access.redhat.com) (verify URL)

**🔧 Hands-on:**
- Oversubscribe your lab host (more busy vCPUs than pCPUs), then inside a guest run top (watch %st rise) and vmstat 1 ('st' column)
- Correlate: while the guest shows high steal, on host run top -H -p <qemu-pid> and see vCPU threads waiting for CPU
- Reduce contention and watch steal drop — prove cause and effect

**✅ Self-check:**
- A customer reports a slow VPS but their own CPU graph looks idle — why immediately suspect steal time, and where do you read it?
- Is steal time a guest problem or a host problem, and who can fix it?

### 7.5 7.5 The OOM / swap death-spiral (the catastrophe to prevent)  _(3-4 hrs)_
**Learn:** If memory overcommit goes wrong: guests' real usage exceeds host RAM -> host swaps -> swap is slow -> everything stalls -> the kernel OOM killer fires and kills processes (possibly qemu processes = random customer VMs killed) -> mass outage. Understand the chain, early detection (swap-in/out, MemAvailable, per-VM RSS, dmesg OOM), and the design choices that prevent it (conservative ram ratio, monitoring/alerting, swap sizing, vm.overcommit_memory policy, and cgroup/memory limits per VM). Note: the kernel's OOM score can be tuned (oom_score_adj) so non-VM helpers die before qemu.

**📚 Materials:**
- Kernel docs: Documentation/admin-guide/mm/ (OOM behaviour) and Documentation/mm/overcommit-accounting.rst (vm.overcommit_memory) (kernel.org)
- Brendan Gregg — the USE method and memory-saturation analysis (brendangregg.com) (verify URL)
- Red Hat virtualization tuning — memory/overcommit cautions (docs.redhat.com) (verify URL)

**🔧 Hands-on:**
- On a DISPOSABLE lab host ONLY: define guests whose committed RAM exceeds host RAM, stress them all to induce swapping; watch vmstat 1 (si/so spike), free -m, and dmesg -w for 'Out of memory: Killed process ... (qemu)'
- Observe the OOM killer terminate a qemu = a customer VM dies with no clean shutdown
- Write the early-warning runbook: which metrics (swap in/out, host MemAvailable, per-VM RSS) you alert on BEFORE OOM, and the ratio knob most responsible

**✅ Self-check:**
- Walk the full causal chain from 'memory oversold' to 'multiple customer VMs down'.
- Name three metrics that warn you hours before the OOM killer fires, and the one allocation-ratio knob most responsible for the risk.

## 8. virtio drivers (paravirtualized devices = the performance contract)
*Why it matters:* virtio vs emulated devices is the difference between a fast VPS and a slow one, and between a Windows VM that boots and one that fails to find its disk. Every Kagoya golden image must ship virtio drivers; Windows images need virtio-win injected. This is a daily 'why is the customer's VM slow / why won't it see its disk' issue.

### 8.1 8.1 Paravirtualization concept: why virtio beats emulation  _(3-4 hrs)_
**Learn:** Emulated devices (e1000 NIC, IDE/SATA disk) mimic real hardware so unmodified guests just work — but every I/O traps to the host expensively. virtio devices are paravirtualized: the guest knows it is virtual and uses an efficient shared-memory ring (virtqueue) to talk to the host, slashing the per-I/O overhead. Requires a virtio driver in the guest. This is the core throughput/IOPS lever for a VPS. (Reality check on numbers: virtio gives large gains, but a quoted '~10x' generally applies only to peak sequential throughput / packet rate — random small I/O and latency improvements are real but usually smaller. Don't promise 10x across the board.)

**📚 Materials:**
- Spec/overview: 'Virtual I/O Device (VIRTIO) Specification' (OASIS, docs.oasis-open.org) — skim the introduction
- Book: 'Mastering KVM Virtualization' (2nd ed.) — virtio / paravirtualized drivers material
- Red Hat: 'Introduction to virtio devices' / para-virtualized drivers documentation (docs.redhat.com) (verify URL)

**🔧 Hands-on:**
- Boot one guest with virtio-blk + virtio-net and one with IDE + e1000; run the same fio disk test and iperf3 network test and compare numbers (note where the gain is large vs modest)
- virsh dumpxml <fast-guest> | grep -E "bus='virtio'|model type='virtio'" vs the slow guest
- Inside a virtio guest: lspci | grep -i virtio and lsmod | grep virtio

**✅ Self-check:**
- Why is virtio faster than emulating an e1000 NIC, in terms of WHERE the work happens?
- What is the catch (what must the guest have), and why is '~10x faster' an overstatement for general workloads?

### 8.2 8.2 The virtio device families (blk, scsi, net, balloon) vs their emulated counterparts  _(3-4 hrs)_
**Learn:** Know each device, its emulated alternative, and when to pick which: virtio-blk (simple, fast disk) vs virtio-scsi (more features — many disks, discard/TRIM, SCSI passthrough) vs emulated IDE/SATA; virtio-net vs emulated e1000/rtl8139; virtio-balloon (memory, topic 7); plus virtio-rng and virtio-serial. For Kagoya, virtio-net + virtio-scsi (or virtio-blk) is the standard performant combo; emulated devices are a compatibility fallback only.

**📚 Materials:**
- libvirt.org: Domain XML reference — <disk> bus options and <interface> model options
- Red Hat documentation comparing virtio-blk and virtio-scsi (docs.redhat.com) (verify URL)
- Book: 'Mastering KVM Virtualization' (2nd ed.) — device models material

**🔧 Hands-on:**
- Edit a lab guest's XML to switch disk bus from 'sata' to 'virtio' (add the <driver>); reboot, confirm the guest still sees its disk and is faster
- Switch NIC model from 'e1000' to 'virtio'; confirm connectivity and measure throughput change
- Add a virtio-scsi controller and a second disk on it; inside the guest verify discard/TRIM works (fstrim -v /)

**✅ Self-check:**
- When would you choose virtio-scsi over virtio-blk for a customer plan?
- Which emulated devices are the fallback, and what is the performance cost?

### 8.3 8.3 virtio-win: making Windows guests fast and bootable  _(3 hrs)_
**Learn:** Windows ships no built-in virtio drivers, so a Windows VM on a virtio disk cannot SEE its boot disk until the driver is loaded — the classic 'no disk found during install' / post-conversion unbootable error. The Fedora-hosted virtio-win ISO supplies signed drivers; load them at install time or pre-inject them. Essential for Kagoya offering Windows VPS plans. The guest agent (qemu-guest-agent / virtio-serial) is also part of this driver set and enables clean shutdown, fsfreeze for consistent snapshots, etc.

**📚 Materials:**
- Fedora: official virtio-win ISO at fedorapeople.org/groups/virt/virtio-win/direct-downloads/ (latest-virtio/ or stable-virtio/) (verify URL)
- virtio-win project: 'Driver installation' wiki (github.com/virtio-win/kvm-guest-drivers-windows/wiki) — official install procedure
- Proxmox VE wiki: 'Windows VirtIO Drivers' (pve.proxmox.com/wiki/Windows_VirtIO_Drivers) — clear step-by-step procedure reference

**🔧 Hands-on:**
- Download the virtio-win ISO; attach it as a second CD-ROM to a Windows install lab VM
- Install Windows with a virtio-blk/scsi disk: when the installer reports 'no disks', Load Driver from the virtio-win ISO and watch the disk appear
- After install, install the virtio NIC + balloon + qemu-guest-agent drivers from the ISO; confirm Device Manager shows virtio devices and the guest agent service runs

**✅ Self-check:**
- Why does a fresh Windows install fail to find its disk on a virtio-blk VM, and how do you fix it during setup?
- What breaks if you switch an already-installed Windows VM from IDE to virtio WITHOUT pre-installing the driver, and how do you do it safely?

## 9. cloud-init & golden images (how VMs get personalized at first boot)
*Why it matters:* A VPS provider does not hand-build every VM — you keep ONE golden qcow2 per OS and let cloud-init inject hostname, SSH key, network, and packages at first boot. This is the mechanism behind 'launch a VPS in 60 seconds' and is exactly what OpenStack's metadata service feeds. It is also the cleanest path off CentOS 7: build fresh Rocky/Alma golden images rather than in-place-upgrading every host.

### 9.1 9.1 What cloud-init is and the first-boot metadata flow  _(3-4 hrs)_
**Learn:** cloud-init is the de-facto first-boot agent baked into cloud images. On first boot it reads a 'datasource' (in OpenStack: the metadata service at link-local 169.254.169.254, or a config-drive ISO) to get instance metadata + user-data, then sets hostname, injects SSH keys, configures networking, and runs scripts — once. Understand the boot stages and where it gets its data in an OpenStack context (config-drive vs metadata service is itself a deployment choice that affects which networks the guest needs).

**📚 Materials:**
- cloud-init official docs: cloudinit.readthedocs.io (Introduction, 'Boot stages', and Datasources -> OpenStack)
- OpenStack docs: 'Metadata service' and 'config drive' (docs.openstack.org)
- Red Hat cloud-init guide or Book: 'Mastering KVM Virtualization' (2nd ed.) — cloud-init / templating material (verify URL)

**🔧 Hands-on:**
- Boot a stock Ubuntu/Rocky cloud image; inside it: cloud-init status --long; cloud-init analyze show (stages/timings)
- Inspect logs: less /var/log/cloud-init.log and /run/cloud-init/instance-data.json (the metadata it received)
- On OpenStack: launch an instance and from inside the guest curl http://169.254.169.254/openstack/latest/meta_data.json to see the metadata it fetched

**✅ Self-check:**
- Where does a cloud-init guest in OpenStack get the customer's SSH key and hostname from, and what are the two datasource mechanisms?
- Why does cloud-init do its main work only on the FIRST boot, and what marks it as 'already run'?

### 9.2 9.2 Building a golden/base qcow2 image  _(3-4 hrs)_
**Learn:** A golden image is a clean, minimal, cloud-init-enabled, virtio-ready qcow2 that you clone for every customer. Learn what goes in (latest patches, virtio drivers, cloud-init installed and reset so it re-runs) and what must come OUT (machine-id, SSH host keys, persistent net rules, logs, shell history). Tools: virt-builder / virt-customize / virt-sysprep (libguestfs). This directly supports both the new plan and the CentOS-7 modernization (fresh Rocky/Alma base images).

**📚 Materials:**
- libguestfs.org: virt-builder, virt-customize, virt-sysprep documentation/man pages (the canonical golden-image toolkit)
- man virt-sysprep and man virt-customize
- Red Hat / libguestfs 'creating cloud images' guidance (verify URL)

**🔧 Hands-on:**
- virt-builder rockylinux-9 --size 10G -o golden.qcow2 (or start from a downloaded official cloud image)
- virt-customize -a golden.qcow2 --install qemu-guest-agent,cloud-init --run-command 'systemctl enable qemu-guest-agent'
- virt-sysprep -a golden.qcow2 (strip machine-id, SSH host keys, logs — making it a true template); then qemu-img info golden.qcow2
- Boot a clone of the golden image and confirm cloud-init runs fresh (new machine-id, regenerated host keys)

**✅ Self-check:**
- Name three machine-specific things virt-sysprep removes and why each breaks cloning if left in.
- Why must the golden image have virtio drivers AND cloud-init pre-installed before you clone it?

### 9.3 9.3 Per-customer injection: user-data, cloud-config, and cloning  _(3 hrs)_
**Learn:** How the same base becomes a unique customer VM: clone the golden qcow2 (or use it as a qcow2 backing file), then feed per-instance user-data (a #cloud-config YAML or script) for hostname, users, SSH keys, packages, and network. Understand cloud-config YAML basics and the metadata-vs-user-data split. This is the unit Nova / your Infra API orchestrates per provision. WARNING on backing files: a backing-file chain means every customer disk depends on the immutable golden image — never edit or delete a base image that has live children, or you corrupt every VM built on it.

**📚 Materials:**
- cloud-init docs: 'User data formats', 'Modules', and 'Examples' (cloudinit.readthedocs.io)
- OpenStack docs: passing user_data and key pairs at boot (docs.openstack.org)
- Tool: cloud-localds (from cloud-image-utils / cloud-utils) man page — builds a seed ISO to test user-data locally

**🔧 Hands-on:**
- Write a #cloud-config: set hostname, add a user + your SSH key, install nginx; build a seed: cloud-localds seed.iso user-data meta-data
- Clone via backing file: qemu-img create -f qcow2 -b golden.qcow2 -F qcow2 customerA.qcow2; boot with seed.iso attached; confirm hostname/key/nginx applied
- Repeat with different user-data to make customerB from the SAME golden image — prove one image -> many customers

**✅ Self-check:**
- What is the difference between metadata and user-data, and which carries the SSH key vs the chosen hostname?
- How does a qcow2 backing file let you provision 100 VMs without copying the base 100 times — and what is the one thing you must NEVER do to that base image afterward?

## 10. Live migration (CONCEPT ONLY)
*Why it matters:* Live migration is how you patch/retire a host (key to CentOS-7 modernization) without taking customers down — move running VMs to another host with near-zero downtime. You need the concept and failure modes now; deep operational mastery comes later. Knowing the constraints prevents you from promising migrations that will fail.

### 10.1 10.1 What live migration does: copy RAM while running, then cut over  _(2-3 hrs)_
**Learn:** virsh migrate (or 'nova live-migration') moves a RUNNING domain to another host: pre-copy iteratively copies guest RAM to the destination while the guest keeps running, re-copying pages the guest dirties, until the remaining dirty set is small enough to pause briefly, copy the last bit + CPU/device state, and resume on the destination — a sub-second 'stop-and-copy' pause. (Post-copy is an alternative that switches execution to the destination early and pulls pages on demand — faster to converge but a network failure mid-migration can lose the VM.) CPU and disk state must be reachable on both ends.

**📚 Materials:**
- libvirt.org: 'Live migration' / migration documentation (libvirt.org)
- QEMU docs: 'Migration' chapter (qemu.org/docs — pre-copy vs post-copy)
- Book: 'Mastering KVM Virtualization' (2nd ed.) — live migration material

**🔧 Hands-on:**
- (Optional concept lab) With two nested KVM hosts that can reach each other: virsh migrate --live <g> qemu+ssh://host2/system and ping the guest throughout
- virsh domjobinfo <g> during a migrate (data copied, remaining, dirty rate)
- Sketch the pre-copy loop on paper: copy -> guest dirties pages -> re-copy -> converge -> brief pause -> switch

**✅ Self-check:**
- In one paragraph, how does the guest stay running while its RAM is being copied?
- What is the brief 'stop-and-copy' moment, why must it exist, and how does post-copy differ in its failure risk?

### 10.2 10.2 Storage: shared storage vs not (the common myth)  _(2 hrs)_
**Learn:** Myth: 'live migration requires shared storage.' Reality: shared storage (Ceph/NFS/SAN) is the EASY case — only RAM/CPU move, the disk stays put. But you CAN migrate without it via block/storage migration (--copy-storage-all / Nova block live migration), which also copies the disk over the network — slower, but works. Know which model each of your two OpenStack deployments uses, because it dictates migration speed and feasibility. For Kagoya: Ceph-backed instances migrate cheaply; local-disk instances need a full block copy.

**📚 Materials:**
- libvirt.org: migration docs — shared vs non-shared storage and the --copy-storage-all flag
- OpenStack Nova docs: 'Live migration' (shared vs block live migration) (docs.openstack.org)
- Red Hat KB on KVM live-migration storage requirements (access.redhat.com) (verify URL)

**🔧 Hands-on:**
- Identify whether host storage is shared: mount | grep -E 'nfs|ceph' (or check the Nova/Cinder backend)
- Read the virsh migrate man section for --copy-storage-all and --copy-storage-inc (do NOT run in prod) — note when each applies
- Write the decision rule: 'shared storage -> migrate RAM only; local storage -> must also copy the disk'

**✅ Self-check:**
- True/false and explain: 'You cannot live-migrate a VM whose disk is on local storage.'
- Why is shared storage faster and safer for migration even though it is not strictly required?

### 10.3 10.3 CPU-model compatibility, cross-cloud limits, and classic failures  _(2-3 hrs)_
**Learn:** The destination CPU must support every feature the guest is using or it faults on resume — which is why production uses a common baseline CPU model (cpu_mode = host-model or a named/custom model, or a per-cluster baseline) rather than host-passthrough. Other classic failures: insufficient destination RAM, migration that never converges (dirty rate > bandwidth), network interruption, mismatched libvirt/qemu versions, missing shared storage. KEY for Kagoya's two deployments: you cannot live-migrate a VM ACROSS two independent OpenStack clouds — live migration moves a VM between compute hosts WITHIN one Nova/Keystone deployment. Moving a workload between your two separate clouds (or between two Keystone realms / regions that don't share a Nova) is a cold migrate/snapshot-and-rebuild operation, not a live migration. (A single cloud with multiple regions is one Keystone; two truly independent deployments are two Keystones — that distinction decides what is even possible.)

**📚 Materials:**
- libvirt.org: CPU model/topology docs (<cpu mode='host-model'> vs 'host-passthrough' vs 'custom') and migration compatibility notes
- QEMU docs: CPU models and migration compatibility
- OpenStack Nova docs: cpu_mode / cpu_models config, live-migration prerequisites; and OpenStack 'regions vs separate deployments' (multiple regions share one Keystone; separate clouds do not) (docs.openstack.org)

**🔧 Hands-on:**
- Compare CPU models of two hosts: virsh capabilities | grep -A5 '<cpu>' on each; use virsh cpu-baseline to compute a common model
- In a lab guest XML, inspect <cpu mode='...'> and reason about whether it could migrate to a slightly older host
- List the 5 classic migration failures with one detection signal each; add the rule 'cross-independent-cloud = NOT live-migratable, use snapshot + rebuild'

**✅ Self-check:**
- Why can host-passthrough CPU mode make a VM un-migratable, and what mode do you use for a migratable fleet?
- Can you live-migrate a customer VM from one of Kagoya's two independent OpenStack deployments to the other? Why or why not, and what is the alternative?

## 11. VM networking at the OS/KVM scope
*Why it matters:* Customer VM traffic enters the world through a tap device on a host bridge, then host NAT/routing (or, under Neutron, an Open vSwitch/integration bridge). To debug 'customer can't reach the internet' or 'VM has no IP', you must own the L2/L3/L4 path from inside the guest, through the tap+bridge, to the host's forwarding — the part of networking BELOW OpenStack Neutron that is physically on your hypervisor.

### 11.1 11.1 Networking vocabulary: L2/L3/L4, MAC/ARP, switching  _(3-4 hrs)_
**Learn:** Ground the layers you use daily: L2 = Ethernet frames + MAC addresses + switching/ARP (MAC<->IP resolution) on a local segment; L3 = IP packets + routing between networks; L4 = TCP/UDP + ports. A bridge is an L2 switch; NAT/routing is L3; ports/sockets are L4. Get this vocabulary solid first — everything else in this topic builds on it.

**📚 Materials:**
- Book: 'Computer Networking: A Top-Down Approach' (Kurose & Ross) — Ch.1 and the link-layer chapter (canonical; library/optional)
- Julia Evans' free zines/blog (wizardzines.com — networking, 'How DNS works') and Beej's Guide (free) for approachable references (verify titles/URLs)
- YouTube: PowerCert Animated Videos — OSI model, MAC vs IP, ARP (named channel, beginner-clear)

**🔧 Hands-on:**
- On host and in guest: ip link (MACs), ip addr (IPs), ip route (L3), ip neigh (the ARP/neighbour table)
- ping a neighbour then watch ip neigh populate; capture an ARP exchange: tcpdump -i <iface> arp
- ss -tulpn (L4: which TCP/UDP ports are listening on which sockets)

**✅ Self-check:**
- At which layer does a MAC address operate vs an IP address vs a port number?
- What does ARP resolve, and on which network scope does it work (and not work)?

### 11.2 11.2 tap devices + Linux bridge (and libvirt's virbr0; OVS under Neutron)  _(3-4 hrs)_
**Learn:** Each VM NIC is backed on the host by a 'tap' device (a virtual Ethernet port the qemu process reads/writes). The tap plugs into a bridge (an in-kernel L2 switch). libvirt's default network creates virbr0 (a NAT bridge); in production you attach taps to a bridge on the physical NIC, or — under OpenStack Neutron — to Open vSwitch (br-int / br-tun) or a Linux bridge managed by the Neutron agent. Path: guest NIC -> tap (vnetN) -> bridge/OVS -> (physical NIC or NAT). This is THE path a customer's packet takes leaving the VM.

**📚 Materials:**
- libvirt.org: 'Networking' docs — default NAT network, bridged networking, and the network XML
- man bridge and man ip (ip link ... type bridge); kernel bridging documentation
- OpenStack Neutron docs: OVS/Linux-bridge agent reference, for how Neutron wires the tap (docs.openstack.org)
- Book: 'Mastering KVM Virtualization' (2nd ed.) — networking material

**🔧 Hands-on:**
- Start a guest on the default network; on host: ip link | grep -E 'virbr0|vnet' (find virbr0 and the guest's vnetN tap)
- bridge link and ip link show master virbr0 (which taps are plugged into the bridge); on an OVS host: ovs-vsctl show
- Map a guest to its tap: virsh domiflist <g> (shows vnetN), then tcpdump -i vnet0 to watch THAT customer's traffic
- Create a bridged (non-NAT) network XML and attach a guest to it

**✅ Self-check:**
- Trace a packet from inside the guest to the physical NIC, naming each hop (NIC -> tap -> bridge/OVS -> ...).
- How do you find which host tap belongs to a specific customer VM so you can sniff only their traffic?

### 11.3 11.3 Host NAT / SNAT / masquerade, the nftables backend, and Neutron floating IPs  _(3-4 hrs)_
**Learn:** On the default network, guests have private IPs and reach the internet via the host doing SNAT/masquerade. The host needs net.ipv4.ip_forward=1 and masquerade rules (libvirt auto-creates them for virbr0). Crucial currency note: on EL8/EL9 and your modernization targets, firewalld uses the NFTABLES backend by default (not legacy iptables), so inspect rules with nft list ruleset — the iptables command may be an nft shim or absent. Understand SNAT/masquerade vs DNAT. In OpenStack this maps up to Neutron: a 'floating IP' is a Neutron-managed 1:1 DNAT/SNAT on the network node giving a private VM a public address — which is a DIFFERENT model from a 'provider network', where the VM gets a routable address directly on a physical/VLAN segment with no floating-IP NAT at all. Know which model Kagoya uses, because it changes where you debug reachability.

**📚 Materials:**
- Netfilter project docs: nftables (and the iptables->nftables migration) (netfilter.org)
- libvirt.org: forwarding/NAT mode of the default network (what rules it creates)
- OpenStack Neutron docs: floating IPs vs provider networks (docs.openstack.org)
- Arch Wiki: 'nftables' and 'Internet sharing' (free, precise reference) (verify URL)

**🔧 Hands-on:**
- sysctl net.ipv4.ip_forward (must be 1 for host routing)
- Inspect the rules libvirt made on a modern host: nft list ruleset | grep -i masquerade (and note iptables -t nat -L may just be an nft shim)
- Break it on purpose in lab: flush the masquerade rule, watch the guest lose internet but still reach the host; restore and confirm
- From the guest: traceroute 8.8.8.8 and see the host/gateway as first hop; on OpenStack, identify whether the VM has a floating IP or a directly-routable provider-network address

**✅ Self-check:**
- Why can a NAT-network guest reach the host but not the internet if masquerade or ip_forward is missing?
- On an EL9 host, which command shows the live NAT rules and why is plain 'iptables' misleading? And how does a Neutron floating IP differ from a provider-network address?

### 11.4 11.4 Ports, sockets, TCP vs UDP from the host's view  _(3 hrs)_
**Learn:** L4 fundamentals you debug daily: a socket = (IP, port, protocol); TCP = connection-oriented, reliable, ordered (handshake, retransmit) — web/SSH; UDP = connectionless, fire-and-forget — DNS/streaming. Understand listening vs established sockets and how to see them on host and guest. Ties together: a customer's service is a listening TCP socket inside the guest, reachable only if the L2/L3/NAT path above is correct AND no firewall/security-group blocks it (Neutron security groups are a separate filtering layer above your bridge).

**📚 Materials:**
- Book: 'Computer Networking: A Top-Down Approach' (Kurose & Ross) — transport-layer chapter (TCP/UDP)
- man ss and man tcpdump
- Beej's Guide to Network Programming (free, beej.us) — sockets and TCP-vs-UDP intro (verify URL)

**🔧 Hands-on:**
- Inside a guest start a service (python3 -m http.server 8080); on guest ss -tlpn (listening). From host/another VM curl the guest IP:8080 and watch ss -t show ESTABLISHED
- Compare TCP vs UDP on the wire: tcpdump -i <iface> port 53 (UDP DNS) vs port 80 (TCP) — note handshake vs none
- ss -s for a socket summary; spot a stuck state (e.g. SYN-SENT = can't reach -> points back to NAT/firewall/security-group)

**✅ Self-check:**
- Define a socket and explain why (IP, port) alone is not enough — what is the third element?
- A customer's web service is listening inside the guest but unreachable from outside — list the layers you check and in what order (tap/bridge L2, NAT/route L3, host firewall + Neutron security group L4).

## 🎯 Phase capstone
Build a miniature end-to-end Kagoya-style VPS host in your lab and prove you own every layer. On ONE KVM host (bare metal or a nested-virt VM): (1) Run virt-host-validate and document the host as 'hypervisor-ready', mapping any WARN/FAIL to a customer impact. (2) Build a virtio-ready, cloud-init-enabled GOLDEN qcow2 with virt-builder/virt-customize/virt-sysprep on a current EL (Rocky/Alma 9) image — explicitly NOT CentOS 7, tying it to the modernization goal; bonus: a Windows image with virtio-win drivers + qemu-guest-agent loaded. (3) Provision TWO 'customer' VMs from that ONE golden image using per-customer cloud-init user-data (distinct hostnames, SSH keys, one running nginx) via a qcow2 backing file — proving one base image -> many customers, and noting you must never mutate the base. Each VM must be persistent + autostart, use virtio-blk/scsi + virtio-net, and sit on a bridge with host masquerade (inspected via nft list ruleset on the modern host) so it reaches the internet. (4) Deliberately oversubscribe CPU+memory so total vCPU/RAM exceeds the host's, stress all guests, and capture evidence: steal time inside the guests, swap-in/out climbing, and (on a DISPOSABLE host only) the OOM killer terminating a qemu = a customer VM down — then write the early-warning runbook (metrics + the allocation-ratio knob, noting where it lives in modern Nova/Placement) that would have prevented it. (5) Walk and document the full debug chain for a forced launch failure (placement/nova-compute/libvirt/qemu/kernel logs in order) AND the network path for a 'no internet' failure (guest -> vnetN tap -> bridge -> masquerade), fixing each. Deliverable: a short runbook + annotated domain XML + the two cloud-init user-data files + a log capture of the OOM event, all explained in terms of 'what the customer experiences and where I look.' If you can do this unaided, you own the layer.

## 🧰 Primary resources for this phase
- Book: 'Mastering KVM Virtualization' (Packt, 2nd ed., 2020; Vedran Dakic, Humble Devassy Chirammal, Prasad Mukhedkar, Anil Vettathu) — the single best end-to-end KVM/QEMU/libvirt/networking/migration text for this role; map almost every topic to a chapter here.
- libvirt.org official documentation — especially the Domain XML format reference (libvirt.org/formatdomain.html), the virsh man page (libvirt.org/manpages/virsh.html), and the Storage, Networking, and Migration guides. This is your daily canonical reference and the actual API layer your Infra API / nova-compute reach.
- QEMU official documentation (qemu.org/docs) — System Emulation, the KVM accelerator, qemu-img/qcow2, and the Migration chapter (pre-copy vs post-copy).
- cloud-init documentation (cloudinit.readthedocs.io) + OpenStack metadata/config-drive docs — for golden-image personalization, the mechanism behind 60-second provisioning.
- OpenStack Nova documentation (docs.openstack.org) — the libvirt virt driver, CPU/RAM overcommit (allocation ratios in nova.conf and Placement), flavor semantics (including the disk=0 boot-from-volume trap), and live-migration prerequisites; plus Neutron docs for floating IPs vs provider networks — the seam where your KVM layer meets the orchestration above it.
- Man pages on a real host (virt-host-validate, virsh, qemu-system-x86_64, qemu-img, virt-sysprep/virt-customize/virt-builder, ss, tcpdump, ip/bridge, nft) plus the Linux kernel admin-guide docs on KSM, hugepages, and OOM/overcommit-accounting (kernel.org) for topic 7; and Brendan Gregg's 'Systems Performance' / brendangregg.com for steal time and the USE method.

---

# Phase 3 — Networking, Deepened (→ Neutron-ready)
**Duration:** 5-6 weeks, part-time (roughly 8-10 hrs/week; ~50-55 hrs total)

> Treat this phase as building the mental "map" you will later overlay onto OpenStack Neutron. Every networking primitive you learn here (a subnet, a default gateway, a NAT rule, a firewall, a DNS record) is something Neutron MODELS as an API object on your two OpenStack deployments — so learn the Linux/host reality FIRST, then bridge to the Neutron noun at the end of each topic. Work in a throwaway lab (two or three small VMs, or Linux network namespaces on one host) so you can break and rebuild routing and firewalls without touching the real KAGOYA fleet. Go slow on subnets/CIDR, routing, NAT, and "the two public-IP mechanisms" — those four are where most VPS infra incidents and most beginner confusion actually live, and they directly gate your "new VPS plan" work (flavor + Cinder are storage/compute, but the plan's networking allowance, floating-IP behavior, and security-group defaults are yours to reason about). One framing note for your two deployments: they are independent clouds (each with its own Keystone/Neutron), NOT two regions of one cloud — so floating-IP pools, provider VLANs, and security-group defaults are configured and debugged per-deployment; never assume an object created on one exists on the other.

## 1. TCP/IP model, the L2/L3/L4/L7 vocabulary, and encapsulation
*Why it matters:* This is the shared language every later topic, every Neutron doc, and every conversation with the Control-Panel/Backend owner is written in. Without it, 'the SG drops it at L4' or 'br-int is an L2 bridge' are noise. As the seam-owner you must speak both 'the API' (L7) and 'the packet' (L3/L4) fluently.

### 1.1 The 4-layer TCP/IP model vs the 7-layer OSI model, and why we say 'L2/L3/L4/L7'  _(2-3 hrs)_
**Learn:** The practical TCP/IP stack (Link, Internet/IP, Transport, Application) and how engineers map shorthand 'L2=Ethernet/MAC, L3=IP, L4=TCP/UDP, L7=HTTP/DNS' onto OSI. Understand that nobody runs a literal 'OSI stack' — OSI is a teaching/labelling reference model, and the layer numbers are what people actually say in tickets and docs.

**📚 Materials:**
- Book: 'Computer Networking: A Top-Down Approach' (Kurose & Ross), 7th/8th ed — Chapter 1, section 1.5 (protocol layers & service models)
- Cloudflare Learning Center: 'What is the OSI Model?' and 'What is the network layer?' articles (learning.cloudflare.com, free)
- YouTube: PowerCert Animated Videos — 'OSI Model Explained' and 'TCP/IP Model Explained'
- RFC 1122 'Requirements for Internet Hosts -- Communication Layers' — skim section 1.1.3 for the canonical 4-layer description

**🔧 Hands-on:**
- Run on one VM: ip link show (see L2/MAC), ip addr show (see L3/IP), ss -tunap (see L4 sockets + the L7 process names) and label each output with its layer
- Draw the 4 layers on paper and place these onto it: MAC address, 192.168.0.10, TCP port 443, HTTP GET, a Neutron 'port', a Neutron 'router'

**✅ Self-check:**
- At which layer does a MAC address live, and at which does an IP address live?
- Your colleague says 'the security group blocked port 22' — which layer is that filtering at, and which layer is the SSH banner text at?

### 1.2 Encapsulation & decapsulation — frames, packets, segments, headers/payloads  _(2-3 hrs)_
**Learn:** How an HTTP request is wrapped: application data → TCP segment (adds ports/seq) → IP packet (adds src/dst IP, TTL) → Ethernet frame (adds src/dst MAC + FCS). Each layer adds a header and treats the layer above as opaque payload; receivers strip headers in reverse order. This is the literal thing an overlay (VXLAN, topic 11) re-wraps a second time.

**📚 Materials:**
- Kurose & Ross — section 1.5.2 'Layering and Encapsulation' (the canonical figure)
- Cloudflare: 'What is a packet?' and 'What is the data link layer?' articles
- YouTube: Practical Networking — 'Network Encapsulation Explained' (part of the free 'Networking Fundamentals' playlist)
- Julia Evans' zine 'Networking! ACK!' (wizardzines.com, paid, optional gem) — superb beginner mental models

**🔧 Hands-on:**
- Capture one packet end-to-end: sudo tcpdump -i eth0 -nn -X -c1 'tcp port 80' while running curl http://example.com from another terminal; identify the Ethernet, IP, and TCP header boundaries in the hex/ASCII
- In Wireshark on a small saved .pcap, expand one HTTP packet and physically see the nested Frame → Ethernet → IP → TCP → HTTP layers

**✅ Self-check:**
- Name the three header types added as a web request goes from app to wire, and one addressing/identifying field each adds.
- Why can a VXLAN overlay (topic 11) 'put a whole Ethernet frame inside a UDP packet'?

## 2. IP addressing — IPv4, private vs public ranges, special-purpose addresses, IPv6 awareness, fixed vs floating
*Why it matters:* You will be allocating, reading, and troubleshooting IPs all day. The metadata address 169.254.169.254 (served by the Neutron metadata agent/proxy) is how every customer VM gets its cloud-init config — if that path breaks, VMs come up with no SSH key and the default hostname. 'Fixed vs floating' is the single most important addressing distinction in OpenStack and directly shapes the new VPS plan.

### 2.1 IPv4 structure, classes (historical) vs CIDR (current), and how to read an address+prefix  _(2 hrs)_
**Learn:** An IPv4 address is 32 bits shown as 4 octets; the /prefix says how many leading bits are 'network'. 'Classful' A/B/C is legacy vocabulary you'll still hear; CIDR (address/prefix) is what is actually used today. This sets up all subnet math in topic 3.

**📚 Materials:**
- Book: 'TCP/IP Illustrated, Volume 1: The Protocols' (Kevin Fall & W. Richard Stevens), 2nd ed — Chapter 2 'The Internet Address Architecture'
- RFC 791 (IPv4) header section + RFC 4632 (CIDR) — read the abstract and the prefix-notation section
- Cloudflare: 'What is an IP address?' and 'What is CIDR?' articles
- YouTube: Practical Networking — 'IP Addresses, Subnet Masks, and CIDR' (Networking Fundamentals playlist)

**🔧 Hands-on:**
- ip -4 addr show on each lab VM; for each address write down the network bits vs host bits implied by its /prefix
- Install and run ipcalc 192.168.10.37/24 and read every field it prints (Network, HostMin, HostMax, Broadcast, Hosts/Net)

**✅ Self-check:**
- In 10.20.30.40/22, how many bits are network and how many are host?
- What replaced 'Class C' in modern addressing, and why was classful addressing abandoned?

### 2.2 RFC1918 private ranges, public/global addresses, and why VMs use private fixed IPs behind NAT  _(2 hrs)_
**Learn:** 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 are private — not routed on the public internet, reusable per tenant. Customer VMs typically get a private 'fixed IP' on a tenant network; reaching the internet needs SNAT (topic 6) or a directly-routable public address (topic 7). This is the economic reason cloud providers host thousands of VMs without thousands of public IPs.

**📚 Materials:**
- RFC 1918 'Address Allocation for Private Internets' — read it; it is short and foundational
- Cloudflare: 'What is a private IP address?'
- OpenStack Networking Guide — 'Networking concepts' / 'Introduction to Networking' (docs.openstack.org/neutron, pin your release)
- YouTube: Practical Networking — 'Public vs Private IP Addresses'

**🔧 Hands-on:**
- Classify a list (small shell loop with ipcalc, or by hand): 10.5.5.5, 172.20.1.1, 192.168.1.1, 8.8.8.8, 172.32.0.1 — which are RFC1918? (172.32.x is the trap.)
- On a lab VM with only a private IP, confirm it cannot be reached from outside but can reach out via the gateway

**✅ Self-check:**
- Is 172.32.5.10 a private address? (Watch the /12 boundary: 172.16.0.0–172.31.255.255.)
- Why does one public IP suffice for many VMs leaving the network, but not for many VMs being reached from outside?

### 2.3 Special-purpose addresses: loopback 127.0.0.0/8, link-local 169.254.0.0/16, and the metadata IP 169.254.169.254  _(3 hrs)_
**Learn:** 127.0.0.1 = 'this host, never leaves the box'. 169.254.0.0/16 = link-local, auto-assigned when DHCP fails, never routed off-link. The magic 169.254.169.254 is a cloud convention: VMs hit it to fetch metadata/userdata; in OpenStack the neutron-metadata-agent (plus a metadata proxy running inside the DHCP or L3 namespace) intercepts it and forwards to nova-api metadata, which serves cloud-init data. Knowing this turns 'VM has no SSH key / wrong hostname' from a mystery into a metadata-path check.

**📚 Materials:**
- RFC 3927 'Dynamic Configuration of IPv4 Link-Local Addresses' (the 169.254.0.0/16 spec)
- OpenStack Networking Guide — 'Config: Metadata service' / 'metadata agent' pages (docs.openstack.org/neutron)
- cloud-init docs — 'Datasources: OpenStack' and 'Instance metadata' (docs.cloud-init.io)
- Red Hat / OpenStack community blog: search 'OpenStack metadata 169.254.169.254 path neutron-metadata-agent' (verify source)

**🔧 Hands-on:**
- From inside a cloud VM: curl http://169.254.169.254/latest/meta-data/ and walk the tree (instance-id, hostname, public-keys/)
- Trace the route: ip route get 169.254.169.254 (note it goes via the DHCP/router device, not the default gateway); on the network/DHCP node, ps -ef | grep -i metadata to see the proxy/agent

**✅ Self-check:**
- A new VM boots with no injected SSH key and the default hostname — name two things on the 169.254.169.254 path you would check.
- Why is 169.254.169.254 reachable from inside a VM even though 169.254.0.0/16 is 'never routed' on the real internet?

### 2.4 Fixed IP vs floating IP (the OpenStack distinction) — first contact  _(1-2 hrs)_
**Learn:** Fixed IP = the private address bound to a VM's Neutron port for the life of that port (its identity on the tenant network). Floating IP = a public address from a pool you attach/detach to a port on demand, giving inbound reachability without changing the VM's own config. This is THE addressing concept that shapes how customers get a public IP in your plan; the deep NAT mechanics come in topic 7.

**📚 Materials:**
- OpenStack Networking Guide — 'Networking concepts: fixed and floating IP addresses' and the 'Floating IP addresses' page
- Red Hat OpenStack Platform 'Configuring Red Hat OpenStack Networking' — floating IP chapter (access.redhat.com, verify title for your OSP version)
- YouTube: a current 'OpenStack Neutron floating IP explained' talk from an OpenInfra Summit/PTG (verify exact talk)

**🔧 Hands-on:**
- (Read-along / sandbox) openstack floating ip list and openstack server show <vm> to see fixed vs floating side by side on a test project
- Sketch a VM with eth0=10.0.0.5 (fixed) and an attached floating 203.0.113.20; label which address the guest OS actually configures internally

**✅ Self-check:**
- If you detach a floating IP from VM-A and attach it to VM-B, what changes for inbound traffic, and what does each VM's own 'ip addr' still show?
- Which IP does the guest OS configure on its interface — the fixed or the floating one?

### 2.5 IPv6 awareness (enough to not be blindsided)  _(2 hrs)_
**Learn:** 128-bit addresses, hex/colon notation, :: zero-compression, link-local fe80::/10, no NAT-as-the-norm (global unicast addresses are directly routable), SLAAC vs DHCPv6 vs DHCPv6-stateless. You do not need IPv6 mastery now, but you must recognize it in tcpdump, in a Neutron subnet's ip_version / ipv6_address_mode / ipv6_ra_mode fields, and know it exists so a v6 address in a log does not stop you.

**📚 Materials:**
- Cloudflare: 'What is IPv6?' and 'IPv4 vs IPv6'
- RFC 4291 'IP Version 6 Addressing Architecture' — skim the address format & scopes
- OpenStack Networking Guide — 'IPv6' chapter (covers Neutron's SLAAC / DHCPv6-stateful / DHCPv6-stateless modes)
- YouTube: Practical Networking — IPv6 fundamentals segment

**🔧 Hands-on:**
- ip -6 addr show — find the fe80:: link-local on each interface and note it is auto-generated per-link
- Compress/expand by hand: write 2001:0db8:0000:0000:0000:0000:0000:0001 in shortest form and back

**✅ Self-check:**
- What does an fe80:: address signify, and is it routable across the internet?
- Roughly how does the 'public IP' problem differ under IPv6 vs IPv4 (is NAT normally needed)?

## 3. Subnets & CIDR math — the skill you must be able to do on a whiteboard
*Why it matters:* You cannot define a Neutron subnet, size a tenant network for the new plan, or judge whether two VMs can talk directly without this. CIDR math also underlies routing (longest-prefix match) and firewall rules (source CIDRs). This is the most 'do it by hand until automatic' topic in the phase.

### 3.1 Binary, the subnet mask, and the network/host split  _(3-4 hrs)_
**Learn:** The /prefix is a contiguous run of 1-bits (the mask). Bitwise-ANDing an address with its mask yields the network address. Build the intuition that /24 = 256 addresses and each extra prefix bit halves the block. Memorize the mask↔prefix table for the common ones.

**📚 Materials:**
- Book: 'TCP/IP Illustrated, Vol.1' 2nd ed — Chapter 2 subnetting sections
- Practical Networking 'Subnetting Mastery' full 7-part playlist (free): https://www.youtube.com/playlist?list=PLIFyRwBY_4bQUE4IB5c4VPRyDoLgOdExE — and the practice drills at subnetipv4.com
- man ipcalc and man sipcalc

**🔧 Hands-on:**
- By hand (no tool) compute network & broadcast for 192.168.5.130/26, then verify with ipcalc 192.168.5.130/26
- Write the prefix↔mask table for /24,/25,/26,/27,/28,/29,/30,/31,/32 from memory; check against sipcalc

**✅ Self-check:**
- What is the dotted-decimal subnet mask for /27, and how many total addresses does a /27 hold?
- How do you derive the network address from any host address + mask?

### 3.2 Network address, broadcast address, usable host range, and counting hosts  _(2-3 hrs)_
**Learn:** In a normal subnet the first address = network ID, the last = broadcast, the rest are usable hosts (usable = 2^hostbits − 2). That '−2' is why a /30 gives only 2 usable. Critical when telling a customer/teammate how many VMs fit in a tenant subnet (and note Neutron's DHCP/gateway also consume usable addresses).

**📚 Materials:**
- Practical Networking 'Subnetting Mastery' playlist — the network/broadcast/usable-hosts episodes
- ipcalc / sipcalc man pages (they label Network, HostMin, HostMax, Broadcast)
- Cloudflare: 'What is a subnet?'

**🔧 Hands-on:**
- For 10.10.10.0/28 list: network, broadcast, first usable, last usable, count of usable — then confirm with sipcalc 10.10.10.0/28
- Assign hosts into a /29 and prove you have run out of usable space when you try the 7th (6 usable in a /29)

**✅ Self-check:**
- How many usable hosts in a /28, and why minus two?
- In 10.0.0.0/24, what are the network and broadcast addresses?

### 3.3 The small prefixes /30, /31, /32 (and why point-to-point and host routes matter)  _(2-3 hrs)_
**Learn:** /30 = classic point-to-point link (2 usable of 4). /31 = special-case 2-address point-to-point link with NO network/broadcast reserved (RFC 3021), used to save addresses on router links. /32 = a single host (a host route, a loopback, or a floating-IP DNAT mapping). You will see /32 constantly in routing tables and floating-IP rules.

**📚 Materials:**
- RFC 3021 'Using 31-Bit Prefixes on IPv4 Point-to-Point Links'
- RFC 1812 'Requirements for IP Version 4 Routers' — skim for host-route context
- Practical Networking — videos covering /31 point-to-point and host routes (verify exact titles)
- ip-route(8) man page (see 'scope host' and /32 routes)

**🔧 Hands-on:**
- Configure a /30 link between two lab VMs (ip addr add 10.99.99.1/30 dev eth1 on one, .2/30 on the peer) and ping across it
- ip route show and find any /32 entries; add a host route: ip route add 203.0.113.99/32 dev eth0 and inspect it

**✅ Self-check:**
- Why does a /31 give 2 usable addresses while a /30 gives 2 usable out of 4 total?
- What does a /32 route represent, and where does a floating IP show up as a /32 in the network node's NAT/route tables?

### 3.4 The 'same subnet?' test → L2 adjacency vs needing a router  _(2-3 hrs)_
**Learn:** Two hosts can talk directly (L2, via ARP→MAC) only if both IPs fall in the SAME subnet (same network bits under the mask). Otherwise the packet must go to the default gateway (topic 5). This single test explains a huge fraction of 'why can't these two VMs reach each other' tickets and maps directly to 'a Neutron network can carry multiple subnets, and inter-subnet traffic needs a Neutron router'.

**📚 Materials:**
- Practical Networking — 'Default Gateway' and same-subnet-vs-different-subnet videos
- Kurose & Ross — Chapter 4 (forwarding) and the ARP section in the link-layer chapter
- OpenStack Networking Guide — 'Networking concepts: networks, subnets, ports' (one network can host multiple subnets)

**🔧 Hands-on:**
- Given 192.168.1.10/24 and 192.168.2.10/24, prove by masking they are NOT same-subnet; then re-mask both as /16 and show they ARE
- On two VMs in the same subnet, watch ARP resolve: ip neigh flush all; ping peer; ip neigh — then move one to a different subnet and watch it fail without a route

**✅ Self-check:**
- Are 10.0.5.20/22 and 10.0.6.20/22 in the same subnet? Show the masking.
- Two VMs cannot ping each other; both are up. What is the first arithmetic check you do?

## 4. ICMP, ping, and traceroute — deeply (and the monitoring trap)
*Why it matters:* Ping is the first tool you reach for, and the first thing that lies to you. Because OpenStack security groups and host firewalls can silently drop ICMP, a perfectly healthy customer VM can look 'down' to a naive ping monitor — a false positive you WILL meet running a VPS service. You must understand ICMP well enough to interpret it correctly.

### 4.1 ICMP basics: echo request/reply, and the other ICMP types you'll actually see  _(2 hrs)_
**Learn:** ICMP is a control/diagnostic protocol carried directly over IP (its own IP protocol number 1 — not inside TCP or UDP). ping uses Echo Request (type 8) / Echo Reply (type 0). You will also meet Destination Unreachable (type 3 — including code 3 port-unreachable and code 4 'fragmentation needed', the MTU signal) and Time Exceeded (type 11). It operates at L3 alongside IP.

**📚 Materials:**
- RFC 792 'Internet Control Message Protocol' — the original, short and readable
- man ping
- Kurose & Ross — the ICMP section in the network-layer chapter
- YouTube: Practical Networking — 'ICMP' and 'Ping & Traceroute' videos

**🔧 Hands-on:**
- ping -c4 a peer and read every field (icmp_seq, ttl, time); then sudo tcpdump -nn icmp on the peer and watch type 8 / type 0
- Trigger a type 3: nc -u a closed UDP port and capture the ICMP port-unreachable (code 3) with tcpdump -nn icmp

**✅ Self-check:**
- Which ICMP type numbers are echo request and echo reply?
- Is ICMP carried inside TCP? What layer does it operate at, and what IP protocol number is it?

### 4.2 TTL and how traceroute actually works (Time Exceeded)  _(2-3 hrs)_
**Learn:** Every IP packet has a TTL decremented by each router; at 0 the router discards it and returns ICMP Time Exceeded (type 11). traceroute exploits this by sending probes with TTL=1,2,3… so each hop reveals itself. Explains '* * *' hops (router not replying to probes/rate-limited, NOT necessarily a break), asymmetric paths, and hop-by-hop latency.

**📚 Materials:**
- man traceroute (read the -I ICMP, -T TCP, -U UDP probe options)
- Cloudflare: 'What is traceroute?'
- Practical Networking — 'How Traceroute Works'
- RFC 792 — the Time Exceeded section

**🔧 Hands-on:**
- traceroute -n 8.8.8.8, then traceroute -I 8.8.8.8 (ICMP probes) vs traceroute -T -p 443 8.8.8.8 (TCP probes) — compare which hops answer
- Set a low TTL yourself: ping -t 1 <distant host> and observe the Time Exceeded from the first router

**✅ Self-check:**
- Which ICMP message makes each traceroute hop reveal itself?
- Why might traceroute show '* * *' for a middle hop yet end-to-end connectivity still works fine?

### 4.3 Reading packet loss & latency from ping; what 'jitter' means; mtr  _(2 hrs)_
**Learn:** Interpreting the summary: packets transmitted/received/loss%, and rtt min/avg/max/mdev (mdev ≈ jitter). Intermittent loss vs total loss vs high-but-steady latency tell very different stories. mtr combines ping+traceroute continuously for a per-hop view. This is your first-line health signal for a customer VM or a hypervisor uplink.

**📚 Materials:**
- man ping (the statistics section)
- man mtr (My Traceroute)
- YouTube: a current mtr tutorial from a network-engineering channel (verify)

**🔧 Hands-on:**
- ping -c 100 -i 0.2 <host> and read the loss% and mdev; then run mtr -rwzbc100 <host> for a per-hop loss/latency table
- Introduce artificial loss/latency: sudo tc qdisc add dev eth0 root netem loss 10% delay 50ms, re-run ping, then sudo tc qdisc del dev eth0 root to clean up

**✅ Self-check:**
- What do rtt min/avg/max/mdev tell you, and which one approximates jitter?
- You see 2% loss reported at hop 5 but 0% at the final destination hop in mtr — is the destination actually losing packets? Why might a middle hop show loss it is not really causing?

### 4.4 The monitoring false-positive: firewall/SG-dropped ICMP makes a healthy host look down  _(2-3 hrs)_
**Learn:** If a security group or firewalld policy drops ICMP echo, ping times out even though SSH/HTTP work fine. A ping-only monitor then pages you for a 'down' VM that is perfectly healthy. Mitigations: probe the actual service port (TCP connect / L7 HTTP check), and/or explicitly allow ICMP where appropriate. This is the practical thread linking topic 4 to topics 9 (firewalls/SGs) and 12 (LB health checks).

**📚 Materials:**
- OpenStack Networking Guide — 'Security groups' (note ICMP is NOT permitted inbound by the default SG)
- Red Hat 'Configuring firewalld' chapter — icmp-block / icmp-block-inversion (access.redhat.com)
- Prometheus blackbox_exporter docs — the tcp_connect and http probe modules vs the icmp probe (github.com/prometheus/blackbox_exporter), to design honest checks
- Blog: search 'ping fails but ssh works security group icmp' (prefer a Red Hat / OpenStack community source — verify)

**🔧 Hands-on:**
- On a lab VM: firewall-cmd --add-icmp-block=echo-request (block ping) while leaving SSH open; confirm ping fails but ssh succeeds; then firewall-cmd --remove-icmp-block=echo-request
- Write an honest check: nc -zv <host> 22 or curl --max-time 3 http://<host>/ to test the real service instead of ping; compare results while ICMP is blocked

**✅ Self-check:**
- A customer VM 'goes down' on your ping monitor but the customer says it is working fine — what is your top hypothesis, and how do you confirm in 30 seconds?
- Why is a TCP-connect or HTTP-200 health check more truthful than an ICMP check for a web VM?

## 5. Routing & the default gateway
*Why it matters:* Routing decides where every packet leaving a VM goes. Misread a route table and you will chase 'works one way but not the other' (asymmetric routing) for hours. In Neutron, L3 routers and their routes are first-class API objects you will create and debug for tenant networks and the new plan's external connectivity.

### 5.1 The routing table, longest-prefix match, and the default route 0.0.0.0/0  _(2-3 hrs)_
**Learn:** A host/router picks the route whose prefix matches the destination with the MOST bits (most specific wins). 0.0.0.0/0 is the catch-all 'default gateway', used only when nothing more specific matches. Reading 'ip route' fluently is a core daily skill.

**📚 Materials:**
- man ip-route (the canonical reference) and man ip-rule
- Practical Networking — 'Routing' and 'Longest Prefix Match' videos
- Kurose & Ross — the forwarding / longest-prefix-matching section in the network-layer chapter
- RFC 4632 (CIDR) — the aggregation & longest-match rationale

**🔧 Hands-on:**
- ip route show; identify the default route, the on-link subnet route, and any /32s; then ip route get 8.8.8.8 and ip route get <a local IP> to watch the kernel's decision
- Add a more-specific route and prove it wins: ip route add 8.8.8.8/32 via <other-gw>; ip route get 8.8.8.8; then ip route del 8.8.8.8/32

**✅ Self-check:**
- Given routes 0.0.0.0/0, 10.0.0.0/8, and 10.5.0.0/16, which is used for destination 10.5.1.1 and why?
- What does the default gateway do, and which destination prefix represents 'the default route'?

### 5.2 How a packet leaves: ARP for the gateway, then hop-by-hop forwarding  _(2 hrs)_
**Learn:** To reach a non-local destination, the host ARPs for the GATEWAY's MAC (not the destination's), frames the packet to the gateway's MAC, and the gateway forwards on. This ties topic 3's same-subnet test to actual delivery and explains why a wrong gateway = total outbound failure even with a perfectly correct IP/subnet.

**📚 Materials:**
- Practical Networking — 'Default Gateway' video (shows the ARP-for-gateway step explicitly)
- man ip-neigh (the modern replacement for arp)
- Kurose & Ross — the link-layer / ARP section

**🔧 Hands-on:**
- ip neigh show, then ping an external host and watch the gateway's MAC (not the destination's) appear/update in the neighbor table
- Break it: set a bogus default gateway (ip route replace default via 10.0.0.254 to a non-existent box), watch outbound fail, then restore the real one

**✅ Self-check:**
- When a VM sends to 8.8.8.8, whose MAC address goes in the destination field of the Ethernet frame?
- You have a valid IP and subnet but no internet — what is the gateway-related check?

### 5.3 Asymmetric routing & return-path problems (the stateful-firewall killer)  _(3 hrs)_
**Learn:** When request and reply take different paths, stateful firewalls/NAT/SGs that need to see BOTH directions can silently drop the return traffic. Common with multi-NIC hosts, source/policy routing, and (in OpenStack) DVR floating IPs. Recognizing 'the SYN arrives but the SYN-ACK is dropped because it came back a different way' is senior-level debugging.

**📚 Materials:**
- Blog: search 'asymmetric routing stateful firewall' (prefer a Red Hat / Cloudflare / Cisco doc — verify source)
- man ip-rule plus the 'Linux Advanced Routing & Traffic Control HOWTO' (LARTC) for policy/source routing (lartc.org) (verify URL)
- OpenStack Networking Guide — the DVR (Distributed Virtual Routing) section, where return-path asymmetry bites floating IPs (sets up topic 7)

**🔧 Hands-on:**
- On a 2-NIC lab VM, create a scenario where replies want to exit the 'wrong' interface; capture with tcpdump on both NICs to SEE the asymmetry; fix it with an ip rule + a source-based ip route table
- With conntrack -L observe a flow seen in only one direction (no reply tuple) vs a fully ESTABLISHED flow

**✅ Self-check:**
- Why does asymmetric routing break stateful firewalls/NAT but not a stateless router?
- Name one OpenStack feature where floating-IP traffic paths can become asymmetric.

## 6. NAT — SNAT/masquerade and DNAT/port-forwarding
*Why it matters:* NAT is how many private VMs share one public IP outbound (SNAT/masquerade) and how an inbound public port reaches a private VM (DNAT). Floating IPs ARE NAT, and provider gateways are deliberately NOT NAT, under the hood — so this topic is the engine room for topic 7 and for explaining the new plan's connectivity to customers.

### 6.1 What NAT is and why it exists; the conntrack state table  _(2 hrs)_
**Learn:** NAT rewrites source and/or destination IP:port in packets and remembers the mapping so replies are translated back. The Linux conntrack (connection tracking) table holds these flows. NAT is why RFC1918 + IPv4 scarcity 'works'. Understanding it as STATEFUL (it must see both directions) connects straight back to asymmetric routing.

**📚 Materials:**
- RFC 2663 (NAT terminology) and RFC 3022 (Traditional NAT) — read the terminology section
- netfilter.org documentation — the connection-tracking (conntrack) pages
- Cloudflare: 'What is NAT?'
- man conntrack (from conntrack-tools)

**🔧 Hands-on:**
- conntrack -L on a NAT box and read a few entries (orig tuple vs reply tuple)
- Watch a mapping appear live: conntrack -E while a VM behind the NAT box curls the internet

**✅ Self-check:**
- What state must a NAT device keep, and why does keeping it make NAT stateful?
- Which Linux tool shows live NAT/connection mappings?

### 6.2 SNAT / MASQUERADE — many VMs, one public IP (outbound)  _(3 hrs)_
**Learn:** Source NAT rewrites the private source IP to the gateway's public IP on the way out; replies are rewritten back. MASQUERADE is the dynamic form (uses whatever the egress interface's current IP is, ideal for DHCP/dynamic uplinks). This is exactly the default outbound path for tenant VMs in OpenStack via the L3 router/provider gateway.

**📚 Materials:**
- nftables wiki — the 'Performing Network Address Translation (NAT)' page (wiki.nftables.org)
- Red Hat 'Configuring and managing networking' — the masquerading / NAT section (access.redhat.com, verify version)
- OpenStack Networking Guide — L3 agent / router SNAT behavior
- YouTube: a masquerade/SNAT demo from a Linux networking channel (verify)

**🔧 Hands-on:**
- Build a 1-router-2-VM lab: enable net.ipv4.ip_forward=1, add masquerade on the egress NIC (nft add rule ip nat postrouting oifname eth0 masquerade OR iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE) and get both private VMs to the internet through one public IP
- On the egress host run tcpdump -nn -i eth0 and confirm both VMs' traffic appears as ONE source IP

**✅ Self-check:**
- After SNAT/masquerade, what source IP does an external server see for two different internal VMs?
- Difference between SNAT (a fixed configured IP) and MASQUERADE (the interface's current IP) — when do you use which?

### 6.3 DNAT / port-forwarding — reaching a private VM from outside  _(2-3 hrs)_
**Learn:** Destination NAT rewrites an inbound public IP:port to a private VM's IP:port (e.g. public:2222 → 10.0.0.5:22). This is how a service on a NAT-hidden VM becomes reachable from outside, and it is mechanically what a floating IP does as a 1:1 DNAT in topic 7.

**📚 Materials:**
- nftables wiki — the NAT page, DNAT/redirect section
- man nft (the nat/dnat statements); man iptables-extensions (the DNAT target)
- Red Hat 'Configuring and managing networking' — the port-forwarding section (verify)
- YouTube: a 'port forwarding / DNAT on Linux' explainer (verify)

**🔧 Hands-on:**
- Add a DNAT: forward the NAT box's tcp/2222 to a private VM's tcp/22 (nft add rule ip nat prerouting tcp dport 2222 dnat to 10.0.0.5:22), then ssh -p 2222 to the public IP and land on the private VM
- Capture both sides with tcpdump to see the destination rewrite happen

**✅ Self-check:**
- Which NAT direction (S or D) lets an outside client reach an inside server, and which lets inside clients reach the outside?
- How is a floating IP a special case of DNAT (plus an SNAT override)?

## 7. The two public-IP mechanisms — floating IP vs provider network (KEEP DISTINCT)
*Why it matters:* This is the make-or-break conceptual topic of the phase for an OpenStack VPS owner. Customers get a public IP one of two fundamentally different ways, and conflating them causes wrong troubleshooting, wrong plan design, and wrong customer answers. The new VPS plan's networking story lives here. (And remember: each of your two deployments has its own external networks and floating-IP pools — verify per-cloud.)

### 7.1 Floating IP = 1:1 DNAT inbound + SNAT-override outbound, performed by the L3 router  _(3 hrs)_
**Learn:** A floating IP is a public address held on the Neutron L3 router / external network and mapped 1:1 to a VM's fixed IP: DNAT for inbound, and an SNAT OVERRIDE so that VM's outbound traffic uses the floating IP instead of the router's shared SNAT address. The guest never sees the public IP on its NIC; the router does the translation. Attach/detach is just rewriting the NAT mapping.

**📚 Materials:**
- OpenStack Networking Guide — 'Floating IP addresses' and the 'L3 agent' page
- Red Hat OpenStack Platform 'Configuring Red Hat OpenStack Networking' — floating IP / L3 router chapter (verify OSP version)
- conntrack / nft / iptables on the network node — the actual DNAT/SNAT rules a floating IP creates inside the qrouter namespace
- OpenInfra Summit/PTG talk: a 'Neutron L3 / floating IP deep dive' (verify exact talk)

**🔧 Hands-on:**
- (Sandbox / DevStack) Create and attach a FIP: openstack floating ip create <ext-net>; openstack server add floating ip <vm> <fip>; then inspect the router namespace: ip netns exec qrouter-<id> iptables -t nat -L -n to SEE the 1:1 DNAT/SNAT rules
- From the VM, curl https://ifconfig.me before and after attaching the FIP and watch the outbound source IP change (the SNAT override)

**✅ Self-check:**
- Does the guest OS configure the floating IP on its own interface? Where does the translation actually happen?
- Detaching a FIP from VM-A and attaching to VM-B — what NAT rules change, and what happens to VM-A's outbound source IP afterward?

### 7.2 Floating IP under DVR — why the path and behavior change  _(2 hrs)_
**Learn:** With Distributed Virtual Routing (DVR), floating-IP NAT happens in an fip namespace ON THE COMPUTE HOST hosting the VM rather than on a central network node — changing the traffic path and where the DNAT/SNAT rules live (a prime source of the asymmetric-routing / 'works on legacy routers but not DVR' surprises from topic 5). You must know DVR exists and changes FIP behavior, even if you do not operate it on day one.

**📚 Materials:**
- OpenStack Networking Guide — the 'Distributed Virtual Routing (DVR)' / high-availability routing chapter
- Red Hat OSP networking docs — 'Distributed virtual routing (DVR)' configuration (verify)
- A current 'OpenStack DVR explained' conference talk or vendor deep-dive blog (verify source)

**🔧 Hands-on:**
- (Read-along) Compare the namespace/iptables layout of a legacy centralized router (qrouter on the network node) vs DVR (qrouter + fip namespace on the compute node); list where DNAT occurs in each
- If a DVR lab is available, trace a FIP packet's path on the compute node (fip namespace) vs a centralized network node

**✅ Self-check:**
- Under DVR, on which host can floating-IP NAT be performed, and why does that change the traffic path?
- Name one debugging symptom that differs between centralized-router and DVR floating IPs.

### 7.3 Provider network = directly routable public address, NO NAT  _(2-3 hrs)_
**Learn:** A provider (flat or VLAN) network maps the VM straight onto an externally-routable L2 segment, so the VM's port gets a PUBLIC, routable IP with NO NAT at all — the guest OS actually configures the public address on its own interface. Simpler path, no FIP translation, but fewer abstractions (no on-demand reassignment, tied to the physical network/VLAN, gateway lives upstream). Many VPS providers use a provider network for the customer's primary public IP.

**📚 Materials:**
- OpenStack Networking Guide — 'Provider networks' and the 'Deployment examples: provider networks' scenario
- OpenStack Install Guide — the 'Provider network' vs 'Self-service network' deployment options (the canonical side-by-side comparison)
- Red Hat OSP networking — flat and VLAN provider networks chapter (verify)
- Neutron ML2 plugin docs — the 'flat' and 'vlan' type drivers

**🔧 Hands-on:**
- (Sandbox) Inspect a VM on a provider network: openstack port show / openstack server show — confirm the port's IP is the public one and there is NO floating IP / no DNAT rule for it
- Contrast: on the host, show a provider-net VM's traffic is bridged straight out (no NAT entries in conntrack) vs a FIP VM (NAT entries present)

**✅ Self-check:**
- On a provider network, does the guest OS configure the public IP itself, and is NAT involved at all?
- Give one operational tradeoff of provider networks vs floating IPs for a VPS plan (on-demand reassignment, scaling, VLAN dependence).

### 7.4 Decision lens: which mechanism for the new VPS plan, and the troubleshooting fork  _(2 hrs)_
**Learn:** Synthesize: choose a provider network for 'every VM just has a public IP, simple, VLAN-backed' vs floating IPs for 'a pool of public IPs, attach/detach on demand, private-first VMs'. The first troubleshooting question for any 'public IP not working' ticket becomes: is this a FIP (check NAT/router namespace/SG) or a provider IP (check VLAN tag / port binding / upstream routing)?

**📚 Materials:**
- OpenStack Install Guide — 'Self-service networks' vs 'Provider networks' deployment examples (side by side)
- OpenStack Networking Guide — 'Networking concepts' for vocabulary alignment
- Your own one-page comparison table (build it as the phase deliverable)

**🔧 Hands-on:**
- Write a decision table (provider vs floating) with columns: NAT? / guest sees public IP? / on-demand reassign? / VLAN dependency? / typical use
- Build a 2-branch troubleshooting flowchart: 'public IP unreachable' → FIP branch vs provider branch, each listing the first 3 checks

**✅ Self-check:**
- For 'each customer VM ships with one fixed public IP, no reassignment needed' — which mechanism, and why?
- A public IP is unreachable — what single question routes you down the correct troubleshooting branch?

## 8. DNS
*Why it matters:* 'It's always DNS.' Customer VMs, your APIs, mail, and the metadata/cloud-init flow all lean on name resolution. As infra owner you will set resolvers, debug forward/reverse mismatches, and field PTR/reverse-DNS requests for customer mail — and Neutron has its own DNS integration (Designate) you will eventually touch.

### 8.1 Resolution flow: stub resolver, recursive resolver, root→TLD→authoritative; caching & TTL  _(2-3 hrs)_
**Learn:** How a name becomes an IP: the stub resolver on the host asks a recursive resolver, which walks root → TLD → authoritative servers, then caches the answer for the record's TTL. TTL is why 'my DNS change hasn't taken effect yet'. This is the backbone for everything else in the topic.

**📚 Materials:**
- Book: 'DNS and BIND' (Cricket Liu & Paul Albitz, O'Reilly, 5th ed) — Chapters 1-2 for HOW DNS works (note: BIND-version specifics are dated; use it for concepts, not current operations)
- Cloudflare Learning: 'What is DNS?' and 'DNS server types' (excellent, current, free primers)
- RFC 1034 (DNS concepts) — skim the resolution-flow section
- YouTube: Computerphile 'DNS' video and PowerCert 'How DNS Works'

**🔧 Hands-on:**
- dig +trace example.com — watch the root→TLD→authoritative walk; then dig example.com twice in a row and compare the falling TTL (cache effect)
- Compare resolvers: dig @8.8.8.8 example.com vs dig @1.1.1.1 example.com; inspect /etc/resolv.conf and (on systemd hosts) resolvectl status

**✅ Self-check:**
- What is the difference between a recursive resolver and an authoritative server?
- You lowered a record's value but the old IP still resolves — which field controls how long that persists, and where?

### 8.2 Record types you must know: A, AAAA, CNAME, MX, NS, PTR (and SOA/TXT awareness)  _(2-3 hrs)_
**Learn:** A = name→IPv4, AAAA = name→IPv6, CNAME = alias, MX = mail routing, NS = delegation, PTR = IP→name (reverse). Plus awareness of SOA (zone authority/serial) and TXT (SPF/DKIM/verification). For a VPS provider, MX and especially PTR (reverse DNS for customer IPs) generate real support work.

**📚 Materials:**
- 'DNS and BIND' 5th ed — the resource-records chapter (concepts)
- Cloudflare Learning: the 'DNS record types' articles (A, AAAA, CNAME, MX, TXT, NS, PTR, SOA)
- RFC 1035 section 3.2.2 (the canonical record-type list)
- man dig and man host

**🔧 Hands-on:**
- Query each type: dig A example.com, dig AAAA example.com, dig MX example.com, dig NS example.com, dig CNAME www.example.com
- Resolve then reverse-resolve: host 8.8.8.8 (PTR) and confirm forward and reverse agree

**✅ Self-check:**
- Which record maps an IP back to a name, and why do receiving mail servers care about it?
- Why can a CNAME not coexist with other records at the same name (the apex/CNAME rule)?

### 8.3 Forward vs reverse DNS, PTR/rDNS for customer IPs, and why a mismatch breaks mail  _(2-3 hrs)_
**Learn:** Forward = name→IP (A/AAAA); reverse = IP→name (PTR in the in-addr.arpa zone). Many mail servers reject senders whose IP has no PTR or whose forward-confirmed reverse DNS (FCrDNS) does not match. As a VPS owner you will delegate or set PTRs for customer public IPs — a frequent ticket. Neutron's Designate also integrates instance DNS.

**📚 Materials:**
- 'DNS and BIND' 5th ed — the in-addr.arpa / reverse-mapping chapter
- Cloudflare / a reputable email-deliverability blog (e.g. Postmark): 'What is reverse DNS (PTR) and why email needs it' (verify source)
- RFC 1912 'Common DNS Operational and Configuration Errors' — the forward/reverse consistency section
- OpenStack Designate (DNSaaS) 'DNS integration' overview (docs.openstack.org/designate)

**🔧 Hands-on:**
- dig -x 8.8.8.8 and dig -x <your VM public IP>; check whether it is forward-confirmed (does the PTR's name resolve back to that same IP?)
- Map the in-addr.arpa name by hand for 203.0.113.45, then verify with dig -x 203.0.113.45

**✅ Self-check:**
- What is the in-addr.arpa name for 198.51.100.7?
- Why does a missing or mismatched PTR cause a customer's outbound mail to bounce or be marked spam?

### 8.4 'It's always DNS': operational failure modes & a debugging playbook  _(2-3 hrs)_
**Learn:** Build a checklist for the classic outages: stale TTL/cache; a wrong /etc/resolv.conf or a systemd-resolved stub on 127.0.0.53; a down/slow resolver; split-horizon surprises; NXDOMAIN vs SERVFAIL meaning; and 'resolves, but to the wrong record'. The skill is fast, ordered triage rather than guessing.

**📚 Materials:**
- Julia Evans — the 'How DNS works' / 'Implement DNS in a weekend' material and her interactive 'mess with dns' tool (messwithdns.com) (free, excellent hands-on)
- Cloudflare: 'DNS troubleshooting' / common DNS issues articles
- man systemd-resolved and man resolvectl
- RFC 2308 'Negative Caching of DNS Queries' — NXDOMAIN/SERVFAIL semantics

**🔧 Hands-on:**
- Break it deliberately: point /etc/resolv.conf (or resolved) at a dead resolver IP, observe the timeout symptom, then fix; distinguish a SERVFAIL (query a deliberately broken delegation) from an NXDOMAIN (query a name that truly does not exist)
- Use resolvectl flush-caches after a record change and re-query to confirm the new answer

**✅ Self-check:**
- Difference between NXDOMAIN and SERVFAIL, and what each implies about WHERE the problem is?
- Give your first three checks when a VM 'can ping IPs but cannot resolve names'.

## 9. Firewalls — firewalld, the iptables→nftables backend shift, and OpenStack security groups
*Why it matters:* You inherit CentOS 7 hosts (firewalld over iptables) and will modernize to EL8/EL9 (firewalld over nftables) — same front-end, changed engine, a classic migration gotcha. CentOS 7 reached EOL on 2024-06-30, and EL7 CANNOT be upgraded in-place to EL9 (you reinstall/rebuild, or hop EL7→EL8→EL9 with tooling), so the firewall backend change is part of that rebuild. In OpenStack, security groups are REALIZED as host iptables/OVS rules. Misreading this layer causes both outages and the topic-4 false 'down' alerts.

### 9.1 Stateful packet filtering & the netfilter model (the foundation under everything)  _(3 hrs)_
**Learn:** How Linux filters: netfilter hooks, the notion of ESTABLISHED/RELATED vs NEW connections (stateful via conntrack), default-deny vs default-allow, and why 'allow established+related' is the universal first rule. This is the conceptual base for firewalld, raw nftables, AND OpenStack security groups.

**📚 Materials:**
- netfilter.org documentation + the nftables wiki (wiki.nftables.org) — the connection-tracking / stateful-firewall pages
- Red Hat 'Securing networks' guide — 'Getting started with nftables' (access.redhat.com)
- The nftables HOWTO (wiki.nftables.org) — the stateful-filtering chapter (free)
- man nft (the ct state / conntrack match section)

**🔧 Hands-on:**
- Write a minimal stateful ruleset in nftables: default-drop input, accept on lo, accept ct state established,related, accept new tcp dport 22 — apply on a lab VM and verify SSH still works while everything else is blocked
- Watch state: conntrack -L while an allowed SSH session is open vs a blocked connection attempt

**✅ Self-check:**
- What do ESTABLISHED and RELATED mean, and why is allowing them the standard first rule?
- Default-deny vs default-allow — which is safer for a public-facing VM, and why?

### 9.2 firewalld as the FRONT-END on both CentOS 7 and EL8/9 — zones, services, rich rules  _(2-3 hrs)_
**Learn:** firewalld gives a stable, zone-based abstraction (public/internal/trusted zones; named 'services' like ssh/http; rich rules) that stays the same command-set across EL versions. Learn zones, runtime vs --permanent, reload semantics, and ICMP blocks (ties back to the topic-4 false-positive).

**📚 Materials:**
- firewalld.org documentation + man firewalld, man firewall-cmd, man firewalld.zone
- Red Hat 'Securing networks' — 'Using and configuring firewalld' chapter
- Linuxize or DigitalOcean 'firewalld basics' tutorial (verify URL)
- YouTube: Learn Linux TV — firewalld tutorial (verify)

**🔧 Hands-on:**
- firewall-cmd --get-active-zones; add a service (firewall-cmd --permanent --add-service=http; firewall-cmd --reload); then add a rich rule limiting SSH to one source CIDR
- Reproduce the topic-4 trap: firewall-cmd --add-icmp-block=echo-request, confirm ping is blocked while ssh is fine, then remove it

**✅ Self-check:**
- What is the difference between a runtime rule and a --permanent rule, and what does --reload do?
- How would you allow HTTP from one /24 only, using a firewalld rich rule?

### 9.3 The backend shift: iptables (CentOS 7) → nftables (EL8/9) and the migration gotchas  _(3 hrs)_
**Learn:** firewalld's BACKEND changed from iptables (EL7) to nftables (EL8+). On EL8/9 the legacy iptables command is actually the iptables-nft compatibility shim writing into nftables; mixing genuinely-legacy iptables (iptables-legacy) rules with nftables rules, or assuming iptables-save shows the whole picture, causes confusing 'rule is present but not working' bugs. Directly relevant to your CentOS 7 → EL8/9 modernization (which is a rebuild, not an in-place EL7→EL9 jump).

**📚 Materials:**
- Red Hat 'Securing networks' — 'Migrating from iptables to nftables' and the firewalld backend (FirewallBackend=) section
- nftables wiki — 'Moving from iptables to nftables' and the iptables-nft compatibility notes
- man iptables-nft, man iptables-legacy, man nft; man firewalld (the FirewallBackend= option)
- Red Hat blog: 'What's new in firewalld / nftables in RHEL 8' (verify exact post)

**🔧 Hands-on:**
- On an EL8/9 (Rocky/Alma) lab VM: nft list ruleset to see firewalld's actual nftables rules; then iptables -S and note it is the nft shim; check the binary with iptables --version (look for nf_tables vs legacy)
- Add a rule via firewall-cmd and confirm it appears in nft list ruleset, proving the front-end/back-end relationship

**✅ Self-check:**
- On EL8/9, what actually realizes a firewalld rule under the hood — iptables or nftables?
- Why can mixing iptables-legacy rules with nftables rules on the same host produce 'present but ineffective' rules?

### 9.4 OpenStack security groups realized as host iptables/OVS firewall rules  _(3 hrs)_
**Learn:** A Neutron security group is an API abstraction; on the compute host it is compiled into real packet-filter rules — either iptables rules via a per-port Linux bridge (the iptables_hybrid firewall driver) or OVS conntrack flow rules (the openvswitch native firewall driver). Security groups are STATEFUL and default-deny inbound (egress allowed by default). Knowing where they land lets you debug 'the SG says allow but traffic is dropped' by inspecting the host directly — and it explains the topic-4 ICMP false-positive at the VM layer (the default SG does not allow inbound ICMP).

**📚 Materials:**
- OpenStack Networking Guide — 'Security groups' and the firewall-driver pages (iptables_hybrid vs openvswitch)
- Neutron docs — 'Open vSwitch native firewall driver'
- Red Hat OSP networking docs — the security groups chapter (verify)
- Talk/blog: 'How Neutron security groups become iptables/OVS rules' (verify source)

**🔧 Hands-on:**
- (Sandbox) On a compute node with the hybrid driver, find a VM's filter chains: iptables -S | grep <port-id-prefix> (look for the qvb/qvo/tap chains) to see the SG rules as real iptables; OR with the OVS driver: ovs-ofctl dump-flows br-int and find the ct() conntrack-based rules
- Add an SG rule (openstack security group rule create) and watch a new host rule appear; confirm default-deny inbound by testing a port you have NOT allowed

**✅ Self-check:**
- Are Neutron security groups stateful, and what is the default inbound vs egress policy?
- With the iptables_hybrid driver, how would you find the actual host filter rules for one specific VM's port?

## 10. Performance vocabulary — bandwidth vs throughput vs latency vs loss, QoS, and noisy neighbors
*Why it matters:* A VPS PLAN is partly a performance promise (and a rate-limit). You must measure honestly with iperf3, distinguish the four metrics customers conflate, and understand QoS/rate-limiting so you can reason about a plan's bandwidth allowance and the noisy-neighbor problem on shared KVM hypervisors.

### 10.1 The four distinct metrics: bandwidth, throughput, latency, loss (and why customers conflate them)  _(2 hrs)_
**Learn:** Bandwidth = the link's theoretical max capacity. Throughput = what you actually achieve. Latency = round-trip delay. Loss = % of dropped packets. They are independent: a high-bandwidth link can still feel 'slow' due to latency (which caps single-stream TCP via the bandwidth-delay product) or loss. Precise language prevents wrong diagnoses and wrong SLA conversations.

**📚 Materials:**
- Cloudflare Learning: 'Bandwidth vs. throughput', 'What is latency?', 'What is packet loss?' articles
- Kurose & Ross — section 1.4 'Delay, Loss, and Throughput in Packet-Switched Networks' (the rigorous treatment)
- YouTube: Practical Networking — bandwidth/throughput/latency explainer (verify)

**🔧 Hands-on:**
- Measure all four on one path: ping for latency/loss, iperf3 -c <server> for throughput; compare throughput against the link's nominal bandwidth
- Demonstrate independence: add latency with tc qdisc add dev eth0 root netem delay 100ms and watch a SINGLE TCP stream's throughput drop even though bandwidth is unchanged

**✅ Self-check:**
- Define bandwidth vs throughput in one sentence each; can sustained throughput exceed the link bandwidth?
- A customer says 'my 1 Gbps VPS is slow' but iperf3 shows 940 Mbps — what metric should you ask about next?

### 10.2 Measuring with iperf3 (TCP & UDP, and reading the output)  _(2 hrs)_
**Learn:** iperf3 (client/server) measures throughput. TCP mode shows achievable rate (affected by latency, window, and the receiver); UDP mode lets you set a target rate and reports jitter + datagram loss. This is your go-to tool for validating a plan's bandwidth allowance and for diagnosing customer 'slow network' claims.

**📚 Materials:**
- man iperf3 and the official iperf3 documentation/FAQ (software.es.net/iperf — ESnet, the canonical maintainer)
- ESnet 'iperf3 user documentation' / FAQ
- YouTube: a current iperf3 tutorial from a network-engineering channel (verify)

**🔧 Hands-on:**
- iperf3 -s on one VM; iperf3 -c <server> -t 20 from another; then add -P 4 (parallel streams) and -R (reverse direction) and interpret the bitrate and the Retr (retransmits) column
- UDP test: iperf3 -c <server> -u -b 100M and read the jitter and lost/total datagrams

**✅ Self-check:**
- What does the Retr column in TCP iperf3 indicate, and what does a high value suggest about the path?
- Why might a single TCP stream under-report a high-bandwidth, high-latency link, and how do you work around it (hint: -P)?

### 10.3 QoS, rate-limiting & traffic shaping — implementing a plan's allowance  _(3 hrs)_
**Learn:** How a 'plan allowance' (e.g. cap a VM at 200 Mbps) is enforced: Linux tc qdiscs (HTB for shaping, netem for emulation) at the host, and in OpenStack the Neutron QoS policy (bandwidth-limit, DSCP-marking, minimum-bandwidth) applied to ports/networks. This is the direct lever you would use to differentiate the new VPS plan's network tier.

**📚 Materials:**
- man tc, man tc-htb, man tc-netem; the LARTC HOWTO shaping chapters (lartc.org) (verify URL)
- OpenStack Networking Guide — the 'Quality of Service (QoS)' chapter (bandwidth-limit rules on ports)
- Red Hat OSP networking — 'Configuring QoS policies' (verify)
- Cloudflare: 'What is quality of service (QoS)?'

**🔧 Hands-on:**
- Shape a VM's egress to 50 Mbps with tc HTB, then prove the cap with iperf3 before/after; remove with tc qdisc del dev <iface> root
- (Sandbox) Create a Neutron QoS policy with a bandwidth-limit rule and attach it to a port: openstack network qos policy create / openstack network qos rule create; verify the limit takes effect

**✅ Self-check:**
- What Linux subsystem enforces per-VM bandwidth limits, and what is the Neutron equivalent?
- If a plan promises 'up to 500 Mbps', which Neutron QoS rule type implements the cap?

### 10.4 The noisy-neighbor problem on shared hypervisors  _(2 hrs)_
**Learn:** On a KVM host shared by many customer VMs, one VM's heavy network (or disk/CPU) use can starve the others — the 'noisy neighbor'. Mitigations: per-VM QoS caps, fair-queuing qdiscs (fq_codel), and placement/overcommit policies. As infra owner this is both a plan-design and a capacity-planning concern (it ties directly to the KVM-capacity verification you do for the new plan).

**📚 Materials:**
- Blog: a cloud-architecture 'noisy neighbor problem' overview (AWS/Azure architecture or a Red Hat virtualization blog — verify source)
- OpenStack Networking Guide — the QoS minimum-bandwidth (guaranteed bw) feature page
- man tc-fq_codel; a fair-queuing (fq_codel) explainer (verify)
- libvirt docs — domain network/IO bandwidth throttling (libvirt.org)

**🔧 Hands-on:**
- Simulate: run two VMs on one host; saturate the link from VM-A with iperf3 and watch VM-B's throughput collapse; then apply a per-VM HTB cap (or libvirt domain bandwidth limit) and show fairness restored
- Inspect the default qdisc with tc qdisc show; switch one interface to fq_codel and re-test latency under load

**✅ Self-check:**
- What is a noisy neighbor, and name two ways to mitigate it for network traffic specifically?
- How does a minimum-bandwidth QoS guarantee differ from a bandwidth-limit cap?

## 11. VLANs/trunking & VXLAN/GRE overlays — per-tenant isolation
*Why it matters:* Multi-tenancy means many customer networks must be isolated over shared physical wires. VLANs (used for provider networks) and VXLAN/GRE overlays (used for tenant/self-service networks) are the two mechanisms Neutron uses. Understanding tagging and encapsulation here is what makes br-int/br-tun in topic 13 finally make sense.

### 11.1 VLANs (802.1Q tagging) and trunk vs access ports  _(2-3 hrs)_
**Learn:** An 802.1Q VLAN tag (12-bit VID → 4094 usable VLANs) partitions one physical switch/wire into many isolated L2 segments. Access ports carry one untagged VLAN; trunk ports carry many tagged VLANs. This is exactly how a Neutron VLAN provider network (topic 7) rides a single physical uplink. The ~4094 ceiling is WHY overlays exist.

**📚 Materials:**
- Cloudflare / a vendor 'What is a VLAN?' explainer (free)
- Practical Networking — 'VLANs Explained' and 'Trunking / 802.1Q tagging' videos (free, excellent)
- man ip-link (the VLAN sub-interface section) and the Linux kernel 802.1Q networking doc
- OpenStack Networking Guide — VLAN provider networks and the ML2 'vlan' type driver

**🔧 Hands-on:**
- Create a tagged VLAN sub-interface: ip link add link eth1 name eth1.100 type vlan id 100; ip addr add ... ; ping a peer on the SAME tag and confirm a different tag cannot reach it
- tcpdump -e -nn -i eth1 and SEE the 802.1Q tag (vlan 100) in the captured frame header

**✅ Self-check:**
- What is the difference between an access port and a trunk port?
- Why does the ~4094-VLAN ceiling push large clouds toward overlays like VXLAN?

### 11.2 VXLAN & GRE overlays — L2-over-L3 tunneling for massive tenant isolation  _(3 hrs)_
**Learn:** VXLAN wraps a whole tenant Ethernet frame inside UDP (24-bit VNI → ~16M segments) so tenant L2 networks ride over the existing routed (L3) underlay between hypervisors — no VLAN ceiling, no physical reconfiguration per tenant. GRE is a similar L3 tunnel (IP protocol 47, not UDP). This is the encapsulation idea from topic 1, applied a second time; it is how Neutron self-service networks span compute hosts.

**📚 Materials:**
- RFC 7348 (VXLAN) — read the abstract + the frame-format figure
- RFC 2784 (GRE) — skim the header format
- Cloudflare / Arista 'What is VXLAN?' explainer (free)
- OpenStack Networking Guide — the tunneling / VXLAN & GRE pages and the ML2 'vxlan' / 'gre' type drivers

**🔧 Hands-on:**
- Build a VXLAN tunnel between two lab hosts: ip link add vxlan0 type vxlan id 42 dev eth0 dstport 4789 remote <peer-ip>; bridge it, assign overlay IPs, ping across; capture the underlay with tcpdump -nn -i eth0 udp port 4789 to see the OUTER UDP wrapping the INNER frame
- Note the frame size / MTU overhead the VXLAN headers add (sets up the next subtopic)

**✅ Self-check:**
- What does VXLAN encapsulate a tenant frame inside, and what problem (vs VLANs) does its 24-bit VNI solve?
- Why do overlays let you add tenant networks without touching the physical switch's VLAN config?

### 11.3 MTU, fragmentation & the overlay-overhead trap  _(2 hrs)_
**Learn:** Every overlay header eats into the usable MTU (VXLAN ≈ 50 bytes of overhead for IPv4). If unaccounted for, large packets get fragmented or — with the DF bit set and ICMP 'frag needed' blocked — silently dropped: the classic 'small pings work, SSH/large transfers hang' overlay bug. Neutron computes a path MTU for you, but you must recognize the symptom and check it.

**📚 Materials:**
- Cloudflare: 'What is MTU?' and a Path MTU Discovery (PMTUD) explainer
- RFC 1191 (Path MTU Discovery) — the concept
- OpenStack Networking Guide — the 'MTU considerations' / MTU configuration page (covers the overlay MTU math)
- man ip (the mtu option); man ping (-M do, -s for payload size)

**🔧 Hands-on:**
- Demonstrate PMTU breakage: ping -M do -s 1472 across the VXLAN (with a default 1500 underlay) and watch it fail; lower the size to fit and watch it succeed; then raise the UNDERLAY MTU (e.g. to 1550) to fix it properly
- Check interface MTUs end-to-end: ip link show | grep mtu on each hop of the overlay path

**✅ Self-check:**
- Roughly how many bytes does VXLAN encapsulation subtract from the usable MTU (IPv4)?
- Explain the 'small pings work but large transfers hang' overlay symptom and its root cause (DF + blocked ICMP frag-needed).

## 12. Load balancers — L4 vs L7, VIPs, health checks (Octavia awareness)
*Why it matters:* Customers (and your own control-plane) put load balancers in front of pools of VMs. Knowing L4 vs L7, virtual IPs, and health checks lets you reason about Octavia (OpenStack's load-balancing service) as a future plan feature and debug 'the LB marked my healthy backend down' — the same false-positive logic as topic 4.

### 12.1 What a load balancer does: VIP, backend pool, and the L4-vs-L7 split  _(2-3 hrs)_
**Learn:** A load balancer presents one Virtual IP (VIP) and distributes connections across a pool of backends. L4 (transport) balances by IP:port — fast, protocol-agnostic, cannot see URLs. L7 (application) understands HTTP and can route by host/path/cookie, terminate TLS, etc. Which one you have determines what you can route on and what you can debug.

**📚 Materials:**
- Cloudflare Learning: 'What is load balancing?' and 'Layer 4 vs Layer 7 load balancing' articles
- HAProxy documentation — the 'Starter Guide' / configuration basics (docs.haproxy.org)
- NGINX docs — 'HTTP Load Balancing' (L7) and 'TCP and UDP Load Balancing' (L4)
- YouTube: Hussein Nasser — 'Layer 4 vs Layer 7 Load Balancing' (verify)

**🔧 Hands-on:**
- Stand up a tiny L7 LB: run 2 backend web servers (python3 -m http.server on each), put HAProxy (mode http) in front, balance between them, and curl the VIP repeatedly to watch it alternate
- Switch HAProxy to mode tcp (L4) and observe you can no longer route by URL path

**✅ Self-check:**
- Give one thing an L7 LB can do that an L4 LB cannot.
- What is a VIP, and how does it relate to the backend pool?

### 12.2 Health checks & the 'healthy backend marked down' false-positive  _(2 hrs)_
**Learn:** LBs probe backends (TCP connect, HTTP GET expecting 200, etc.) and remove failers from rotation. A wrong probe (pinging when ICMP is blocked, checking '/' when the app serves '/health', too-tight timeouts) ejects healthy backends — the exact false-positive pattern from topic 4, now at the LB layer. Designing honest health checks is the skill.

**📚 Materials:**
- HAProxy docs — the 'Health checking' section and option httpchk
- NGINX docs — 'Health checks' (active and passive)
- Cloudflare: 'What is a health check?' / load-balancer health monitoring
- OpenStack Octavia docs — the 'Health monitors' page (docs.openstack.org/octavia)

**🔧 Hands-on:**
- Configure an HTTP health check expecting 200 on /health; kill one backend's app and watch the LB eject it (and re-add it on recovery) in the HAProxy stats page
- Reproduce the false-positive: set the health check to ICMP/ping while ICMP is firewalled, watch a healthy backend get marked down, then fix the check to TCP/HTTP

**✅ Self-check:**
- Name three ways a health check can wrongly mark a healthy backend as down.
- Why is an 'HTTP 200 on /health' check more reliable than an ICMP ping check?

### 12.3 Octavia awareness — OpenStack LBaaS and where the VIP/SG live  _(2 hrs)_
**Learn:** Octavia provides load balancing in OpenStack, by default via 'amphora' VMs running HAProxy, with a VIP port on a Neutron network, plus listeners (L4/L7), pools, members, and health monitors. You do not need to operate it on day one, but you must recognize the object model and that its VIP, security groups, and floating IP follow everything you learned in topics 7, 9, and 12.

**📚 Materials:**
- OpenStack Octavia docs — the 'Basic cookbook' / 'Getting started' and the component glossary (loadbalancer / listener / pool / member / healthmonitor)
- Red Hat OSP — 'Using Octavia for load balancing' (verify)
- An OpenInfra Summit Octavia intro talk (verify)

**🔧 Hands-on:**
- (Read-along / sandbox) Map the Octavia object model to what you know: which object holds the VIP (a Neutron port), which sets L4 vs L7 (the listener protocol), which is the health check (the health monitor)
- If a DevStack Octavia is available: openstack loadbalancer create / listener create / pool create / member add / healthmonitor create, then curl the VIP

**✅ Self-check:**
- In Octavia, which object holds the VIP, and which object defines L4 vs L7 behavior?
- How does an Octavia load balancer get a public IP (which earlier topic applies)?

## 13. The bridge into Neutron — mapping every primitive to an OpenStack API object
*Why it matters:* This is the payoff capstone-topic: it converts all of Phase 3 into the exact mental model you need to own the Infra API seam and ship the new VPS plan. Every Linux concept now becomes a Neutron noun you will create, read, and debug via the API/CLI.

### 13.1 The core object map: network=L2, subnet=addressing, port=vNIC, router=L3+SNAT, floating IP, security group  _(3 hrs)_
**Learn:** Neutron network = an L2 broadcast domain; subnet = CIDR + gateway + DHCP/DNS settings attached to a network; port = a vNIC (MAC + fixed IP(s) + security groups) that a VM/router/DHCP plugs into; router = the L3 gateway doing inter-subnet routing + SNAT to the external network; floating IP and security group as already learned. Seeing these as the API form of topics 2, 3, 5, 6, 7, and 9 is the whole point.

**📚 Materials:**
- OpenStack Networking Guide — 'Networking concepts' (the canonical network / subnet / port / router definitions)
- OpenStack Networking API reference — the network, subnet, port, router, floatingip, and security-group resources (docs.openstack.org/api-ref/network)
- Red Hat OSP networking — the concepts chapter (verify)
- OpenStack Install Guide — the 'Launch an instance' networking section (shows the objects working together)

**🔧 Hands-on:**
- (Sandbox / DevStack) Build a self-service topology end-to-end: openstack network create; subnet create; router create; router add subnet; router set --external-gateway; then boot a VM and attach a floating IP — narrating which Phase-3 concept each step is
- openstack port show <vm-port> and identify the fixed IP (topic 2), the subnet (topic 3), and the security groups (topic 9) on it

**✅ Self-check:**
- Match each to a Neutron object: L2 broadcast domain; CIDR+gateway; vNIC; inter-subnet routing+SNAT.
- Which Neutron object performs SNAT for tenant VMs, and which provides the 1:1 inbound DNAT?

### 13.2 The dataplane: br-int, br-ex, br-tun and how ports/overlays are realized  _(3 hrs)_
**Learn:** On each host, Open vSwitch bridges implement the model: br-int (integration bridge) is where VM ports attach and local VLAN tags isolate them; br-tun carries VXLAN/GRE overlays between hosts; br-ex bridges out to the physical/external network (provider nets and floating-IP egress). This connects topics 9, 11, and 7 to the actual switching fabric you will inspect when debugging. (Note: deployments using the OVN mechanism driver replace br-tun/agents with OVN's own datapath — know which your two clouds run.)

**📚 Materials:**
- OpenStack Networking Guide — the 'Open vSwitch agent' / OVS bridge pages and the 'Open vSwitch' deployment diagrams
- Neutron docs — the OVS agent internals / br-int, br-tun, br-ex explanation page
- man ovs-vsctl, man ovs-ofctl (you will use these to inspect bridges and flows)
- A current 'Neutron OVS dataplane packet walk' conference talk or Red Hat deep-dive blog (verify)

**🔧 Hands-on:**
- (Sandbox) ovs-vsctl show to list br-int/br-tun/br-ex and the VM tap ports; ovs-ofctl dump-flows br-int to see the local-VLAN isolation flows; find your VM's tap port and trace its bridge attachment
- Walk one packet conceptually from VM tap → br-int → (br-tun VXLAN OR br-ex provider) and write down each hop

**✅ Self-check:**
- What is br-int responsible for vs br-tun vs br-ex?
- Where on the host does a VXLAN-encapsulated tenant packet get built, and where does a provider-network packet exit?

### 13.3 The agents: L2, L3, DHCP, and metadata — who does what (and what breaks when each dies)  _(3 hrs)_
**Learn:** In the OVS/agent architecture, Neutron's work is done by agents: the L2 (OVS) agent wires ports and VLAN/overlay isolation on each host; the L3 agent runs routers (SNAT/DNAT, floating IPs) inside qrouter namespaces; the DHCP agent leases fixed IPs (via dnsmasq) inside qdhcp namespaces; the metadata agent + proxy serve 169.254.169.254 (topic 2). Knowing each one's failure signature — 'no IP' = DHCP, 'no SSH key' = metadata, 'no outbound internet' = L3, 'port not wired at all' = L2 — is the core operational skill for the seam-owner.

**📚 Materials:**
- OpenStack Networking Guide — the 'Networking agents' overview and the per-agent pages (L3, DHCP, metadata, OVS agent)
- Neutron man/usage pages: neutron-l3-agent, neutron-dhcp-agent, neutron-metadata-agent, neutron-openvswitch-agent
- OpenStack 'Networking troubleshooting' guide (agent and namespace debugging)
- Red Hat OSP 'Networking troubleshooting' chapter (verify)

**🔧 Hands-on:**
- (Sandbox) openstack network agent list — see each agent and its alive/admin state; ip netns list, then enter a router or DHCP namespace (ip netns exec qrouter-<id> ip addr) to inspect the L3/DHCP guts
- Map failure→agent: deliberately stop the DHCP agent (or metadata agent) in a lab, observe a new VM's symptom (no lease / no injected SSH key), then restart it and confirm recovery

**✅ Self-check:**
- A new VM gets no IP at all — which agent do you suspect first? No injected SSH key? No outbound internet?
- Which agent runs the router namespaces that perform floating-IP DNAT and tenant SNAT?

## 🎯 Phase capstone
Build a from-scratch, fully-instrumented "mini-cloud network" in a throwaway lab (3 small VMs, or Linux network namespaces on one host, or a DevStack all-in-one if you can spare the resources) and produce a one-page "Phase-3 to Neutron Rosetta sheet" as the written deliverable. Concretely: (1) Create two private subnets and prove the same-subnet/L2-adjacency test BOTH by hand (masking) and by ARP (ip neigh). (2) Stand up a Linux box as a router doing ip_forward + MASQUERADE so both subnets reach the internet through ONE public IP (SNAT), then add a DNAT port-forward so an outside client can SSH to an inner VM — and explain in writing how each maps to a Neutron router (SNAT) and a floating IP (1:1 DNAT + SNAT override). (3) Build a VXLAN overlay between two hosts, prove tenant isolation, and deliberately trigger then fix the MTU/PMTU 'large transfers hang' bug (block ICMP frag-needed to reproduce the silent-drop variant, then fix via underlay MTU). (4) Put firewalld (nftables backend on an EL8/9 box) plus a minimal stateful nftables ruleset in front of a VM, confirm via nft list ruleset that the firewalld rule lands in nftables, then reproduce the topic-4 false-positive by blocking ICMP while SSH stays up, and design an honest TCP/HTTP health check that does not lie. (5) Put a 2-backend HAProxy L7 load balancer with an HTTP health check in front and show it ejecting a killed backend and re-adding it on recovery. (6) Cap one VM's bandwidth with tc/HTB and verify the cap with iperf3 (your 'plan allowance' proof). Finish by writing the Rosetta sheet that maps EACH thing you built — subnet, gateway/router, SNAT, DNAT/port-forward, public IP, VXLAN segment, firewall rule, health check, bandwidth cap — to its exact Neutron object (network / subnet / port / router / floating-ip / security-group / QoS-policy) AND its dataplane location (br-int / br-tun / br-ex, and which agent owns it). Acceptance: a colleague reading ONLY your Rosetta sheet could correctly answer 'for the new VPS plan, is a customer's public IP a floating IP or a provider IP, and where would I debug it if it's down?' — and could state which of the two independent deployments they are reasoning about.

## 🧰 Primary resources for this phase
- OpenStack Networking Guide + Neutron docs (docs.openstack.org/neutron) — the single most important resource: networking concepts, provider vs self-service networks, floating IPs, DVR, security groups, QoS, the OVS agent/bridges, and the L2/L3/DHCP/metadata agents. Pin the docs version that matches each of your two (independent) deployments.
- Practical Networking 'Networking Fundamentals' YouTube series + the 7-part 'Subnetting Mastery' playlist (free): https://www.youtube.com/playlist?list=PLIFyRwBY_4bQUE4IB5c4VPRyDoLgOdExE plus drills at subnetipv4.com — the clearest beginner-to-rigorous treatment of encapsulation, subnetting, routing, NAT, VLANs, and VXLAN; do the subnetting drills until automatic.
- Kurose & Ross, 'Computer Networking: A Top-Down Approach' (7th/8th ed) — the academic backbone for layering/encapsulation (Ch.1.5), delay/loss/throughput (Ch.1.4), routing & forwarding (Ch.4), and the link layer/ARP.
- Red Hat 'Securing networks' and 'Configuring and managing networking' guides (access.redhat.com) — the canonical, version-correct reference for firewalld, the iptables→nftables backend shift, masquerading/NAT, and EL8/9 specifics directly relevant to the CentOS 7 (EOL 2024-06-30) → EL8/9 modernization, which is a rebuild, not an in-place EL7→EL9 upgrade.
- Cloudflare Learning Center (learning.cloudflare.com) — fast, accurate, free conceptual primers for every term in this phase (OSI, IP, CIDR, NAT, DNS, MTU/PMTUD, bandwidth/latency/loss, VLAN, VXLAN, load balancing). Use as the first read for any unfamiliar concept.
- Canonical man pages + RFCs as ground truth: man ip / ip-route / ip-rule / ip-neigh / nft / firewall-cmd / dig / iperf3 / tc / conntrack / ovs-vsctl / ovs-ofctl, and RFCs 1918 (private IPs), 791 & 792 (IP & ICMP), 1034/1035 (DNS), 3927 (link-local), 3021 (/31 links), 7348 (VXLAN), 1191 (PMTUD).

---

# Phase 4 — APIs, Python, Git, Ansible (the seam)
**Duration:** 12-16 weeks part-time (split 4A: weeks 1-8 HTTP/REST + Python; 4B: weeks 9-16 Git/Ansible/IaC/CI-CD)

> This phase teaches the "seam" — the Infra API contract where YOUR layer (Infra API to OpenStack to KVM) meets the Backend engineer's Control Panel. Everything here is the connective tissue of your day job: you will read and call REST APIs, script glue in Bash and Python, drive the openstacksdk to create a flavor and a Cinder volume type for the new VPS plan, and use Git plus Ansible (an inherited system) to change CentOS-7 hosts safely. Treat 4A as "learn to speak HTTP/JSON and Python so OpenStack obeys you," and 4B as "learn to change fleet config and ship it through review/CI without breaking prod or the Backend engineer's expectations." Two ideas are load-bearing. First, the API CONTRACT (4A-5): a versioned, agreed promise between you and the other engineer — internalize "500 means YOUR server crashed; 4xx means the caller was wrong" and "never break the contract silently." Second, your two OpenStack deployments are INDEPENDENT clouds with SEPARATE Keystones — a token from one is useless on the other; they are two named entries in clouds.yaml, not two regions of one cloud. Always practice on a lab mirror (DevStack or an all-in-one), never the prod fleet; --check dry-runs are a habit, not an option.

## 1. 4A-1: Client-server model & HTTP fundamentals
*Why it matters:* Every call into OpenStack/Keystone/your Infra API is an HTTP request. Before you can design or debug the seam, you must read a request/response like a sentence: method + URL + headers + body in, status + headers + body out. The 500-vs-4xx distinction is your daily triage reflex (is the bug mine or the caller's?).

### 1.1 Request/response, client vs server, statelessness  _(3-4 hrs)_
**Learn:** An HTTP exchange is one request -> one response, classically over a TCP connection (HTTP/2 multiplexes many on one connection; HTTP/3 runs over QUIC/UDP — but the request/response shape is the same). The CLIENT (Control Panel, curl, your script) asks; the SERVER (Infra API, Keystone, Nova) answers. HTTP is STATELESS: the server keeps no per-client memory between calls, so every request must carry its own auth/context (this is WHY you send a token header every time).

**📚 Materials:**
- MDN Web Docs: 'An overview of HTTP' and 'HTTP Messages' (developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
- Book: 'HTTP: The Definitive Guide' (Gourley & Totty, O'Reilly) ch.1-3 — overview, URLs, HTTP messages
- YouTube: Hussein Nasser — 'HTTP Crash Course & Explanation' / 'Fundamentals of Backend Engineering' playlist (verify URL)

**🔧 Hands-on:**
- curl -v https://example.com — read the request line, headers, and response status echoed by -v
- curl -v https://httpbin.org/get and identify: method, path, Host header, and the JSON the server echoes back
- Open browser DevTools -> Network tab on any site, click one request, read Headers/Response/Timing

**✅ Self-check:**
- What three parts make up an HTTP request, and what three make up a response?
- Why must an auth token be sent on EVERY request rather than once at 'login'? Tie this back to statelessness.

### 1.2 Methods: GET / POST / PUT / PATCH / DELETE and safe vs unsafe  _(2-3 hrs)_
**Learn:** GET reads (safe, no side effects). POST creates (NOT idempotent — two POSTs make two things). PUT replaces a whole resource. PATCH partially updates. DELETE removes. 'Safe' = read-only; 'idempotent' = repeating the call leaves the same END STATE on the server (GET/PUT/DELETE yes, POST no). Note: idempotent is about server state, not about the response code being identical each time.

**📚 Materials:**
- MDN: 'HTTP request methods' (developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- RFC 9110 (HTTP Semantics) sections 9.2.1 (safe), 9.2.2 (idempotent), 9.3 (methods) — the canonical spec
- MDN glossary entries: 'Idempotent' and 'Safe (HTTP methods)'

**🔧 Hands-on:**
- curl -X GET https://httpbin.org/get ; curl -X POST -d 'a=1' https://httpbin.org/post — compare echoed method/body
- curl -X PUT -d 'x=1' https://httpbin.org/put and curl -X PATCH -d 'x=1' https://httpbin.org/patch
- curl -X DELETE https://httpbin.org/delete and note no body is required

**✅ Self-check:**
- Which methods are idempotent and why does that matter for a retry after a network timeout?
- If creating a VPS flavor is a POST, what bug appears if your client auto-retries on timeout?

### 1.3 URL, headers, body anatomy  _(2-3 hrs)_
**Learn:** A URL = scheme://host:port/path?query#fragment. Headers carry metadata (Authorization, Content-Type, Accept; for OpenStack the Keystone token rides in the X-Auth-Token header). The body carries the payload (usually JSON). Content-Type tells the server how to parse your body; Accept tells it what representation you want back.

**📚 Materials:**
- MDN: 'HTTP headers' reference index + 'What is a URL?' (developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL)
- MDN: 'Content-Type', 'Authorization', 'Accept' header pages
- RFC 3986 (URI Generic Syntax) section 3 — for the precise URL grammar (reference only)

**🔧 Hands-on:**
- curl -H 'Accept: application/json' -H 'X-Custom: hi' https://httpbin.org/headers and read which headers the server saw
- Break a URL like https://api.example.com:443/v2.1/servers?limit=10 into its parts on paper
- curl -H 'Content-Type: application/json' -d '{"name":"test"}' https://httpbin.org/post

**✅ Self-check:**
- What header does a Keystone-issued token ride in for OpenStack service calls (Nova/Cinder)?
- What goes wrong if you send a JSON body but set Content-Type: text/plain?

### 1.4 Status codes 2xx/4xx/5xx — '500 = your server crashed'  _(2-3 hrs)_
**Learn:** 2xx = success (200 OK, 201 Created, 202 Accepted for async work, 204 No Content). 4xx = the CLIENT was wrong (400 bad request, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict, 422 unprocessable). 5xx = the SERVER failed (500 unhandled exception in YOUR code; 502 bad gateway / 503 unavailable / 504 gateway timeout = upstream/overload/timeout, often from a service BEHIND your API). Triage reflex: 4xx -> fix the caller; 5xx -> fix the server (you). Note: 202 matters because OpenStack create-calls are often asynchronous (you get 202 + a resource you must poll until ACTIVE).

**📚 Materials:**
- MDN: 'HTTP response status codes' (developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- RFC 9110 section 15 — full status code semantics
- http.cat / httpstatuses.io — quick per-code reference (verify URL)

**🔧 Hands-on:**
- curl -i https://httpbin.org/status/200 then /404 then /500 then /503 — read the -i status line each time
- Write a 1-line note next to each: who is at fault (client or server)?
- curl -i https://httpbin.org/status/418 — see a non-standard code and how clients should treat an unknown 4xx (treat as generic 400-class)

**✅ Self-check:**
- A Control Panel call to your Infra API returns 500. Whose bug is it, and where do you look first?
- Difference between 401, 403, and 404 in one sentence each? And what does a 202 imply you must do next?

## 2. 4A-2: REST & resource-oriented thinking
*Why it matters:* OpenStack APIs (Nova /servers /flavors, Cinder /volumes /types) and your own Infra API are REST-style. To extend the Infra API for the new plan you must think in resources/collections and pick the right method (PUT vs PATCH) and the right place for parameters (path vs query). Getting idempotency right is what makes retries and Ansible/CI safe.

### 2.1 Resources, collections, and URL design (/servers /flavors /volumes)  _(3-4 hrs)_
**Learn:** REST models the world as nouns (resources) addressed by URLs. A collection is /flavors; an item is /flavors/{id}. Methods are the verbs acting on those nouns. Good design: plural nouns, no verbs in paths (POST /flavors, not /createFlavor). Note OpenStack is REST-ISH, not textbook-pure (e.g. it uses 'action' sub-resources like POST /servers/{id}/action with a JSON body naming the action) — useful to see real-world pragmatism vs the ideal.

**📚 Materials:**
- Book: 'REST API Design Rulebook' (Mark Massé, O'Reilly, 2011) ch.2-3 — URI design (dated but the URI rules still hold)
- Microsoft 'Web API design best practices' (Azure Architecture Center, learn.microsoft.com/azure/architecture/best-practices/api-design)
- OpenStack Compute (Nova) API reference — Servers, Flavors sections (docs.openstack.org/api-ref/compute/)

**🔧 Hands-on:**
- Map the new VPS plan on paper: which collection holds flavors, which holds Cinder volume types, what's the item URL for each
- Browse the live Nova API reference and find the exact path + method to 'Create flavor' and 'List flavors'
- Browse the Cinder (Block Storage) API reference for 'Create a volume type' path + method

**✅ Self-check:**
- Why is POST /createFlavor considered bad REST and what's the correct call?
- Given /flavors/{flavor_id}/os-extra_specs, what resource hierarchy does that express?

### 2.2 Idempotency in practice  _(2-3 hrs)_
**Learn:** An idempotent call leaves the same END STATE no matter how many times it runs. GET/PUT/DELETE are idempotent; POST is not. This is the bedrock of safe retries, Ansible's 'desired state', and CI re-runs. When designing the Infra API, prefer idempotent shapes (e.g., create-or-update keyed on a stable identifier, or accept a client-supplied idempotency key) where it reduces blast radius. Caution: OpenStack flavor-create is a plain POST and is NOT idempotent — a blind retry can create a duplicate or hit a 409, so your script must check-then-create or handle the conflict.

**📚 Materials:**
- MDN glossary: 'Idempotent'
- RFC 9110 section 9.2.2 (Idempotent Methods)
- Stripe blog: 'Designing robust and predictable APIs with idempotency' (stripe.com/blog/idempotency — verify URL)

**🔧 Hands-on:**
- On httpbin: POST the same body twice to /post (imagine each creates a flavor) and reason about duplicate creation
- Sketch how an idempotency key header would let a client safely retry a flavor-creation POST
- Reason about DELETE /flavors/{id} called twice: first 204, second 404 — is the END STATE still idempotent? (yes — the flavor is gone both times)

**✅ Self-check:**
- Is DELETE idempotent even though the second call returns 404? Explain via the end-state argument.
- OpenStack flavor-create is a non-idempotent POST — what defensive pattern keeps your script safe on retry?

### 2.3 PUT vs PATCH (full replace vs partial update)  _(2 hrs)_
**Learn:** PUT sends the COMPLETE new representation and replaces the resource (omitted fields may be cleared). PATCH sends only the fields to change. Use PATCH to tweak one field; use PUT when you intend to define the whole object. Mixing them up can silently wipe data. Real-world wrinkle: Nova flavor extra_specs are managed as their own sub-collection (POST to add/update a key, DELETE to remove a key) rather than via PUT/PATCH on the flavor — confirm in the API ref before you assume.

**📚 Materials:**
- MDN: 'PUT' and 'PATCH' method pages
- RFC 5789 (PATCH Method for HTTP) — what PATCH formally is
- RFC 7396 (JSON Merge Patch) — one common PATCH body format

**🔧 Hands-on:**
- curl -X PUT vs -X PATCH against httpbin /put and /patch with a partial body; note both echo, but reason about intent
- Write two example bodies for the same change: a PUT (full object) and a PATCH (one field)
- Find in the Nova API ref exactly how updating a flavor's extra_specs works (POST per key? DELETE per key?) — confirm, don't guess

**✅ Self-check:**
- If a resource has 5 fields and you PUT a body with 1, what happens to the other 4 under strict PUT semantics?
- How does Nova actually manage extra_specs, and why does that surprise someone expecting PATCH?

### 2.4 Path params vs query params  _(2 hrs)_
**Learn:** Path identifies WHICH resource (/flavors/{id}) — it's part of the resource's address. Query (?limit=10&sort=name) filters, paginates, or shapes a collection request. Rule: if removing it changes WHICH thing you mean, it's a path param; if it only filters/shapes results, it's a query param. OpenStack paginates with ?limit and ?marker (marker = the id to start after), not page numbers — learn that pattern.

**📚 Materials:**
- Microsoft 'Web API design best practices' — filtering, paging, sorting section
- OpenStack API-ref pages showing ?limit, ?marker, ?sort_key query params (docs.openstack.org/api-ref/compute/)
- MDN: 'What is a URL?' (query string portion)

**🔧 Hands-on:**
- curl 'https://httpbin.org/get?limit=10&name=basic' and read how httpbin parses args
- Classify these as path or query: the server UUID, a page size, a flavor id, a status filter
- Construct the Nova URL to list servers with pagination (?limit & ?marker) from the API ref

**✅ Self-check:**
- Is a flavor's ID a path or query param? Why?
- How does OpenStack's marker-based pagination differ from ?page=2, and why does it matter for large lists?

## 3. 4A-3: JSON <-> Python data structures
*Why it matters:* A flavor's specs, a volume type, and every API body are JSON. Your Python scripts and the openstacksdk hand you Python dicts/lists that mirror that JSON. Fluency converting between the two — and knowing when a number is secretly a string — is the difference between a working flavor definition and a 400 error.

### 3.1 JSON syntax and types (objects, arrays, strings, numbers, bool, null)  _(2 hrs)_
**Learn:** JSON has objects {"k": v}, arrays [a, b], strings (double-quoted only), numbers, true/false, null. No comments, no trailing commas, no single quotes. A flavor spec like {"vcpus": 2, "ram": 4096, "name": "plan-basic"} is a JSON object (ram is in MB in Nova).

**📚 Materials:**
- json.org — the one-page grammar (canonical)
- MDN: 'Working with JSON' (developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON)
- RFC 8259 (The JSON Data Interchange Format) — reference

**🔧 Hands-on:**
- Hand-write a JSON object for the NEW VPS plan flavor (name, vcpus, ram in MB, disk in GB) and validate it with: echo '<json>' | jq .
- Deliberately add a trailing comma and a single-quoted key, then watch jq (or jsonlint.com) reject them
- echo '{"vcpus":2,"ram":4096}' | jq . to pretty-print and confirm validity

**✅ Self-check:**
- Name three things legal in a Python dict literal but illegal in JSON.
- Is {'name': 'basic'} (single quotes) valid JSON? Why not?

### 3.2 Mapping JSON to Python: dict/list/str/int/bool/None  _(3-4 hrs)_
**Learn:** JSON object -> Python dict; array -> list; string -> str; number -> int/float; true/false -> True/False; null -> None. The json module: json.loads(text)->Python, json.dumps(obj)->text. Watch the type trap: APIs distinguish "4096" (string) from 4096 (int), and many OpenStack extra_specs values are STRINGS by design (e.g. 'hw:cpu_policy': 'dedicated') even when they look numeric — send the type the API expects.

**📚 Materials:**
- Python docs: 'json — JSON encoder and decoder' (docs.python.org/3/library/json.html) — see the conversion tables
- Real Python: 'Working With JSON Data in Python' (realpython.com/python-json/)
- Book: 'Python Crash Course' 3rd ed (Eric Matthes, No Starch) — dictionaries & lists chapters

**🔧 Hands-on:**
- python -c "import json; d=json.loads('{\"vcpus\":2}'); print(type(d), d['vcpus'])"
- Round-trip: json.load(open('flavor.json')), modify ram, json.dump back out to a new file
- Trigger and read a json.JSONDecodeError by loading a file with a trailing comma

**✅ Self-check:**
- What Python type does a JSON array become, and how do you access its 2nd element?
- Why might sending ram as "4096" (str) instead of 4096 (int) get rejected, and why are many extra_specs values intentionally strings?

### 3.3 Navigating nested JSON (the shape of real OpenStack responses)  _(2-3 hrs)_
**Learn:** Real responses nest and wrap: {"flavors": [{"id":..., "links":[...]}, ...]}. You walk them with response['flavors'][0]['id']. Learn to read a sample response, find the path to the value you need, handle lists-of-dicts, and use dict.get('key') to avoid KeyError on optional fields.

**📚 Materials:**
- OpenStack Nova API reference — 'List Flavors' response examples (docs.openstack.org/api-ref/compute/)
- jq manual: 'Basic filters' (jqlang.github.io/jq/manual/) for path navigation
- Real Python: 'Working With JSON Data in Python' (nested access section)

**🔧 Hands-on:**
- Save a real Nova list-flavors JSON sample to a file; with jq extract '.flavors[].name'
- In Python, loop the parsed flavors list and print id+name for each, using .get() defensively
- Extract the first flavor's first link href: data['flavors'][0]['links'][0]['href']

**✅ Self-check:**
- Given {"flavors":[{...}]}, write the Python to get the name of the first flavor safely.
- What jq filter prints every flavor's vcpus?

## 4. 4A-4: API authentication — keys, bearer tokens & Keystone (TWO independent clouds)
*Why it matters:* You cannot touch OpenStack without authenticating to Keystone, getting a time-limited token, and putting it in a header on every call. Project (and domain/system) scope decides WHICH tenant you can act on. Critically: your two deployments have SEPARATE Keystones, so they are two distinct clouds — not two regions of one cloud — and a token from one is rejected by the other. Mixing up authn (who you are) vs authz (what you may do) is the root of most 401/403 confusion.

### 4.1 API keys & bearer tokens (the general pattern)  _(2 hrs)_
**Learn:** The simplest auth: a secret (API key or bearer token) sent in an Authorization header. 'Authorization: Bearer <token>' means 'trust the bearer of this token.' Tokens leak if logged or committed — treat them like passwords and scope/expire them tightly. (Keystone uses its own X-Auth-Token header rather than 'Bearer', but the bearer concept — possession = access — is the same.)

**📚 Materials:**
- MDN: 'Authorization' header + 'HTTP authentication' (developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)
- OWASP 'REST Security Cheat Sheet' (cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) — token handling
- RFC 6750 (OAuth 2.0 Bearer Token Usage) — what 'Bearer' means

**🔧 Hands-on:**
- curl -H 'Authorization: Bearer test123' https://httpbin.org/bearer and read the auth result
- curl https://httpbin.org/bearer (no header) -> see the 401 you get without a token
- Practice NOT echoing a token: store it in an env var and use -H "Authorization: Bearer $TOKEN"

**✅ Self-check:**
- Why is a bearer token as sensitive as a password?
- Keystone uses X-Auth-Token, not Authorization: Bearer — what concept do the two share?

### 4.2 Keystone v3 flow: authenticate -> scoped token -> X-Auth-Token on every call  _(4-5 hrs)_
**Learn:** OpenStack: you POST credentials (user + password + a SCOPE, e.g. project) to Keystone v3 /v3/auth/tokens; it returns a token in the X-Subject-Token RESPONSE header that expires (commonly ~1h, deployment-configurable). You then send that token as the X-Auth-Token REQUEST header on every Nova/Cinder call. The token's body includes a SERVICE CATALOG listing each service's endpoint URLs — that's how your code discovers the Nova/Cinder endpoints rather than hardcoding them.

**📚 Materials:**
- OpenStack Identity (Keystone) API reference — 'Password authentication with scoped authorization' (docs.openstack.org/api-ref/identity/v3/)
- OpenStack docs: 'Identity API v3 — authentication and token management' / Keystone admin guide (docs.openstack.org/keystone/latest/)
- OpenStack 'API Quick Start' (docs.openstack.org/api-quick-start/)

**🔧 Hands-on:**
- On a lab/DevStack: POST a v3 scoped-auth body to /v3/auth/tokens and capture the X-Subject-Token response header
- curl a Nova /flavors call passing -H "X-Auth-Token: $TOKEN" using that token
- Inspect the token response JSON's 'catalog' and find the compute (nova) public endpoint URL

**✅ Self-check:**
- Which RESPONSE header carries the new Keystone token, and which REQUEST header carries it onward?
- What is the service catalog and why does it mean you should not hardcode the Nova endpoint?

### 4.3 authn vs authz, token scope, 401 vs 403  _(3-4 hrs)_
**Learn:** Authentication (authn) = proving who you are. Authorization (authz) = what that identity may do, governed by your ROLE within a SCOPE (project, domain, or system). 401 Unauthorized = not authenticated (bad/expired/missing token). 403 Forbidden = authenticated but not allowed (wrong role/scope). An UNSCOPED token can authenticate but can't act on project resources — a classic 403 trap.

**📚 Materials:**
- OpenStack Keystone docs: 'Tokens', 'Scopes and roles' (project/domain/system) (docs.openstack.org/keystone/latest/)
- MDN status pages: '401 Unauthorized' and '403 Forbidden'
- OWASP cheat sheet: authn vs authz definitions

**🔧 Hands-on:**
- On lab: call an API with an EXPIRED token -> observe 401; with a valid token but a project where you lack the role -> observe 403
- Request an UNSCOPED token, then call a project resource and watch it fail — then re-request scoped and succeed
- Inspect a token's metadata (scope, expiry) via the catalog/response where the format allows

**✅ Self-check:**
- You get a 403 from Nova with a fresh, valid token — name two likely causes.
- Why does an unscoped token authenticate but still get rejected for project actions?

### 4.4 Two SEPARATE Keystones = two clouds, not two regions  _(3-4 hrs)_
**Learn:** A REGION is a partition WITHIN one cloud that SHARES a single Keystone (one identity, one token works across all its regions). Your two deployments instead run INDEPENDENT Keystones, so they are two separate clouds: separate users, separate tokens, separate service catalogs. A token from cloud A is meaningless to cloud B. In tooling this means TWO named entries in clouds.yaml (e.g. cloud: cloudA / cloud: cloudB) — you select one per call with --os-cloud or openstack.connect(cloud=...). Getting this wrong is a top source of cross-cloud 401s.

**📚 Materials:**
- OpenStack openstacksdk docs: 'Configuration (clouds.yaml)' (docs.openstack.org/openstacksdk/latest/user/config/configuration.html)
- OpenStack Keystone docs: 'Regions' vs separate deployments (docs.openstack.org/keystone/latest/)
- OpenStack 'API Quick Start' — environment/cloud selection (docs.openstack.org/api-quick-start/)

**🔧 Hands-on:**
- Write a clouds.yaml with TWO named clouds (cloudA, cloudB), each with its own auth_url/Keystone
- openstack --os-cloud cloudA flavor list, then --os-cloud cloudB — confirm distinct catalogs and that swapping the token between them fails
- On paper, contrast: 'list both regions of one cloud' vs 'switch between two clouds' and why only the latter applies here

**✅ Self-check:**
- What's the technical difference between a region and a separate cloud, in terms of Keystone and tokens?
- How does clouds.yaml let one script target both of your independent deployments, and what selects which one?

## 5. 4A-5: The API CONTRACT (most role-critical idea)
*Why it matters:* The Infra API IS the contract between you and the Backend engineer. A 'breaking change' here silently breaks their Control Panel in production. This subtopic is the spine of the whole role: learn what a contract promises, what breaks it, and how versioning lets you evolve without betraying callers.

### 5.1 What an API contract is (the agreed promise)  _(3-4 hrs)_
**Learn:** A contract = the set of guarantees the API makes to its callers: available endpoints, request shapes, response shapes/field names/types, status codes, error formats, pagination behavior, and observable behavior. Once another team builds against it, those guarantees are load-bearing. The contract is the interface; implementation behind it can change freely as long as the promise holds.

**📚 Materials:**
- Book: 'The Design of Web APIs' 2nd ed (Arnaud Lauret / 'API Handyman', Manning) — design + evolving/versioning chapters
- API Handyman blog (apihandyman.io) — contract & design posts
- Microsoft 'Web API design best practices' — consistency section (learn.microsoft.com/azure/architecture/best-practices/api-design)

**🔧 Hands-on:**
- Write the contract for one new-plan Infra API endpoint: method, path, request fields+types, response fields+types, status codes, error-body shape
- Hand that one-pager to the Backend engineer (or a peer) and have them code a mock client against it — gaps reveal under-specification
- List every field name in a flavor response and mark which the Control Panel likely depends on

**✅ Self-check:**
- Name four distinct things an API contract promises beyond just the URL.
- Can you refactor the code behind an endpoint without changing the contract? When is yes, when is no?

### 5.2 Breaking vs backward-compatible changes  _(3-4 hrs)_
**Learn:** Backward-COMPATIBLE (safe): adding a new OPTIONAL request field, adding a new endpoint, adding a field to a response (callers should ignore unknown fields — 'tolerant reader'), loosening validation. BREAKING: renaming/removing a field, changing a type (int->string), making an optional request field required, changing a status code or error shape, tightening validation, changing default pagination. Breaking changes must never ship silently to existing callers.

**📚 Materials:**
- Google API Improvement Proposals AIP-180 'Backwards compatibility' (google.aip.dev/180)
- Book: 'The Design of Web APIs' (Lauret) — the 'evolving an API' chapter on what breaks
- Stripe API changelog / 'API upgrades' docs as a real-world versioned-evolution example (stripe.com/docs/upgrades — verify URL)

**🔧 Hands-on:**
- Take your flavor response and classify 6 hypothetical changes (rename ram->memory_mb; add a field; make name required; change disk type to string; etc.) as breaking or safe
- Add an OPTIONAL field to a mock response and confirm an existing client still parses it (tolerant reader)
- Rename a field in the mock and watch the existing client break — feel the difference

**✅ Self-check:**
- Is adding a new optional response field breaking? Is renaming an existing one?
- Why is 'tightening input validation' a breaking change even though it sounds safer?

### 5.3 Versioning strategies & coordinating a contract change  _(4-5 hrs)_
**Learn:** When you MUST break, version it: URL path (/v2.1/), header-based (OpenStack MICROVERSIONS via the OpenStack-API-Version request header), or media-type. The old version stays until callers migrate. Coordination is a HUMAN process: announce, ship the new version side-by-side, give a migration window, deprecate (signal it), then remove. With the Backend engineer this is a planned, communicated handoff — never a surprise deploy. OpenStack microversions are your real-world model: the same endpoint behaves differently based on the requested version, and unknown/old clients keep getting the old behavior.

**📚 Materials:**
- OpenStack 'API Microversions' developer guide (docs.openstack.org/api-guide/compute/microversions.html) — your real-world model
- Book: 'API Design Patterns' (JJ Geewax, Manning) — versioning chapter; plus 'The Design of Web APIs' versioning chapter
- Google AIP-185 'Documentation: versioning' and AIP-180 (google.aip.dev/185, /180)

**🔧 Hands-on:**
- Design a v2 of one Infra API endpoint that introduces a breaking change; keep v1 alive; write the migration note for the Backend engineer
- Inspect OpenStack microversions: curl Nova with and without 'OpenStack-API-Version: compute <ver>' and diff the responses
- Draft a deprecation timeline (announce -> dual-run -> deprecation header/notice -> remove) for the v1 endpoint

**✅ Self-check:**
- Give three ways to version an API and one trade-off of each.
- Walk through the steps to retire an old endpoint without breaking the Control Panel.

## 6. 4A-6: Reading & writing API docs (OpenAPI/Swagger)
*Why it matters:* You'll spend more time reading OpenStack's API reference and writing the spec for your Infra API than calling it ad hoc. OpenAPI is the machine-readable form of the contract from 4A-5 — it drives docs, mock servers, client generation, and the CI contract checks you'll build in 4B.

### 6.1 Reading API references (Nova/Cinder/Keystone) & Swagger UI/Redoc  _(3-4 hrs)_
**Learn:** An API reference lists each endpoint: method, path, params (path/query/body), request example, response example, and status codes. Swagger UI and Redoc render an OpenAPI document into a browsable, try-it page. Learn to locate the exact call and its required fields fast. (Note: OpenStack's own api-ref is generated from its source, not hand-written Swagger — but it reads the same way.)

**📚 Materials:**
- OpenStack API reference portal (docs.openstack.org/api-ref/) — Compute (Nova), Block Storage (Cinder), Identity (Keystone)
- Swagger UI demo (petstore.swagger.io) and Redocly/Redoc demo (redocly.github.io/redoc/) to learn both readers
- OpenStack 'API Quick Start' (docs.openstack.org/api-quick-start/)

**🔧 Hands-on:**
- In the Nova API-ref, find and write down the full spec to 'Create flavor' and 'Create or update extra-specs'
- In the petstore Swagger UI, expand an endpoint, read its schema, and use 'Try it out'
- In the Cinder API-ref, locate 'Create a volume type' and note required vs optional fields

**✅ Self-check:**
- From the Nova API-ref, what are the required body fields to create a flavor?
- What does Swagger UI's 'Try it out' actually do (it sends a real HTTP request from your browser)?

### 6.2 Writing an OpenAPI 3 spec for your Infra API  _(4-5 hrs)_
**Learn:** OpenAPI (YAML/JSON) describes paths, methods, parameters, request/response schemas (with types & a 'required' list), and security schemes. Writing it forces you to pin down the contract precisely; it then generates docs, mocks, and validation. This is how you publish the seam to the Backend engineer. Use OpenAPI 3.0.x for the widest tool support and 3.1 (JSON-Schema-aligned) where your tools support it.

**📚 Materials:**
- OpenAPI Specification (spec.openapis.org) + the 'OpenAPI Guide' on swagger.io (swagger.io/docs/specification/about/)
- Swagger Editor (editor.swagger.io) — free, validates as you type
- Book: 'Designing APIs with Swagger and OpenAPI' (Ponelat & Rosenstock, Manning)

**🔧 Hands-on:**
- In editor.swagger.io, write a minimal OpenAPI 3 doc for ONE new-plan Infra API endpoint (path, request schema, 200/400 responses)
- Add a securityScheme (bearer/apiKey) to that spec and a reusable components/schemas Flavor object
- Render your spec in Redoc: npx @redocly/cli preview-docs your-spec.yaml — read it as your caller would

**✅ Self-check:**
- In OpenAPI, where do you declare which fields are required (hint: a 'required' list, not per-field)?
- How does one OpenAPI file become both human docs AND a CI contract check?

## 7. 4A-7: Bash + curl + jq + ssh/scp glue
*Why it matters:* Day-to-day infra work is gluing tools together: curl to hit an API, jq to extract the field you need, ssh/scp to reach a hypervisor, all wrapped in a Bash script. This is your fastest path from 'manual click' to 'repeatable command' and the substrate Ansible later automates.

### 7.1 Bash scripting essentials (variables, quoting, exit codes, pipes, set -euo pipefail)  _(4-5 hrs)_
**Learn:** Bash glues commands: variables ($VAR), command substitution $(...), pipes |, exit codes ($? — 0=success), conditionals, loops. Quoting rules prevent word-splitting disasters. 'set -euo pipefail' makes a script fail fast: -e exit on error, -u error on unset variable, -o pipefail make a pipeline fail if any stage fails. Caveat: -e has surprising exceptions (e.g. inside if-conditions, with command substitution) so it is a safety net, not a guarantee — still verify exit codes on critical commands.

**📚 Materials:**
- Book: 'The Linux Command Line' (William Shotts, free PDF at linuxcommand.org) — Part 4: shell scripting
- Google 'Shell Style Guide' (google.github.io/styleguide/shellguide.html)
- ShellCheck (shellcheck.net) — lints scripts for common Bash bugs; install and run locally too

**🔧 Hands-on:**
- Write a script with 'set -euo pipefail' that takes a flavor name arg and prints it; test missing-arg behavior (-u fires)
- Run your script through shellcheck (CLI or shellcheck.net) and fix every warning
- Demonstrate the quoting bug: a variable with spaces unquoted vs quoted in a for-loop

**✅ Self-check:**
- What does each letter of 'set -euo pipefail' do, and name one case where -e does NOT trigger?
- Why does "$VAR" (quoted) behave differently from $VAR when the value contains spaces?

### 7.2 curl deep-dive for APIs  _(3-4 hrs)_
**Learn:** curl is your API Swiss-army knife: -X method, -H header, -d/--data / --data-raw body, -i show response headers, -v verbose, -s silent, -o save, -w write-out (e.g. '%{http_code}'), -u basic auth, --fail/--fail-with-body to make HTTP 4xx/5xx a non-zero exit. Combine with env-var tokens for safe auth. Know that --fail SUPPRESSES the error body — use --fail-with-body (modern curl) when you still want to read the error JSON.

**📚 Materials:**
- 'Everything curl' free online book (everything.curl.dev) — esp. the HTTP chapters
- man curl (the OPTIONS section)
- Daniel Stenberg (curl author) blog (daniel.haxx.se) for context and gotchas

**🔧 Hands-on:**
- curl -s -w '\n%{http_code}\n' https://httpbin.org/status/204 to capture the status code separately
- curl --fail -s https://httpbin.org/status/500 ; echo $? — see the non-zero exit; then try --fail-with-body to keep the body
- POST JSON with a token: curl -s -X POST -H "Authorization: Bearer $TOK" -H 'Content-Type: application/json' -d '{...}' URL

**✅ Self-check:**
- What does --fail change about curl's exit code, and how does --fail-with-body differ from --fail?
- How do you make curl print ONLY the HTTP status code?

### 7.3 jq for JSON extraction & transformation  _(3-4 hrs)_
**Learn:** jq is a JSON processor: '.field', '.array[]', '.array[] | select(.x==y)', '.a.b.c', building new objects '{name:.name}', and -r for raw (unquoted) output to feed into the shell. Pairs with curl to pull exactly the value you need from an API response. Use -e to set jq's exit code from the result (handy in scripts to detect 'no match').

**📚 Materials:**
- jq manual (jqlang.github.io/jq/manual/) — Basic filters, select, object construction
- jq tutorial (jqlang.github.io/jq/tutorial/)
- jqplay.org — interactive playground to test filters

**🔧 Hands-on:**
- curl -s nova-flavors.json | jq -r '.flavors[].name' to list names one per line
- jq '.flavors[] | select(.vcpus >= 2) | .id' on a sample to filter + project
- Build a new object: jq '{name:.name, cpus:.vcpus}' from a flavor object; try jq -e to detect empty results in a script

**✅ Self-check:**
- What does -r do and when do you need it?
- Write a jq filter that returns the id of every flavor with ram > 2048.

### 7.4 ssh & scp for reaching hypervisors safely  _(4-5 hrs)_
**Learn:** ssh user@host runs commands on a remote KVM host; key-based auth (ssh-keygen, ssh-copy-id, ~/.ssh/config, ProxyJump for bastions) beats passwords. scp/sftp copies files (note: modern OpenSSH defaults scp to the SFTP protocol). Know how to run a one-off remote command (ssh host 'uptime') and that known_hosts / host-key checking protects you from MITM — never blindly disable StrictHostKeyChecking on hosts you care about. This is also exactly how Ansible reaches hosts (it is ssh under the hood).

**📚 Materials:**
- Book: 'SSH, The Secure Shell: The Definitive Guide' (Barrett/Silverman/Byrnes, O'Reilly) — keys & config chapters
- man ssh, man ssh_config, man scp
- DigitalOcean tutorial: 'SSH Essentials: Working with SSH Servers, Clients, and Keys' (digitalocean.com/community/tutorials — verify URL)

**🔧 Hands-on:**
- ssh-keygen -t ed25519, then ssh-copy-id to a lab VM, then ssh in passwordlessly
- Create a ~/.ssh/config Host entry (alias, user, IdentityFile, ProxyJump bastion) and connect via the alias
- ssh labhost 'nproc' (or grep -c processor /proc/cpuinfo) to read remote core count; scp a file both directions

**✅ Self-check:**
- Why is key-based ssh preferable to passwords for hypervisor access?
- What does ProxyJump (bastion) buy you, and how does this relate to how Ansible connects?

## 8. 4A-8: Python for infrastructure (incl. openstacksdk for the new-plan work)
*Why it matters:* Python is the language of OpenStack tooling (openstacksdk, python-openstackclient) and your own automation. You'll write scripts that authenticate, create the new flavor + volume type, verify host capacity, and call your Infra API — moving beyond curl glue to robust, testable code.

### 8.1 Python core for infra (types, dicts/lists, functions, control flow)  _(8-10 hrs)_
**Learn:** Variables and core types (str, int, float, bool, None), collections (list, dict, tuple, set), functions with parameters/return, if/for/while, f-strings, modules/imports. Enough to read API responses (dicts/lists) and write clear, small functions. Reality check: CentOS 7's SYSTEM python is 2.7 and its python3 is old (3.6.x via SCL/EPEL); develop against a modern Python (3.10+) in a venv and only target the old interpreter where you truly must run ON the legacy host.

**📚 Materials:**
- Book: 'Python Crash Course' 3rd ed (Eric Matthes, No Starch) — Part I, chapters 1-11
- Official Python Tutorial (docs.python.org/3/tutorial/)
- Free course: 'Python for Everybody' (Dr. Charles Severance, py4e.com) — free videos + text

**🔧 Hands-on:**
- Write a function flavor_summary(flavor: dict) -> str that formats name/vcpus/ram from a dict
- Loop a list of flavor dicts and print only those with vcpus >= 2
- Build a dict for the new-plan flavor in Python and json.dumps it to a valid JSON string

**✅ Self-check:**
- How do you safely get a possibly-missing key from a dict (vs crashing with KeyError)?
- What's the difference between a list and a dict, and which models a JSON array vs object?

### 8.2 venv & pip (isolated, reproducible environments)  _(2-3 hrs)_
**Learn:** A virtual environment isolates a project's packages from the system Python (critical on CentOS 7, where the system Python is old and fragile and yum itself depends on it — break it and you break the host's package manager). python3 -m venv .venv, activate, pip install, pip freeze > requirements.txt, pip install -r requirements.txt to reproduce. Never pip install into the system Python on a host you care about; never 'sudo pip' on CentOS 7.

**📚 Materials:**
- Python docs: 'venv — Creation of virtual environments' (docs.python.org/3/library/venv.html)
- Python Packaging User Guide: 'Install packages in a virtual environment using pip and venv' (packaging.python.org)
- Real Python: 'Python Virtual Environments: A Primer' (realpython.com/python-virtual-environments-a-primer/)

**🔧 Hands-on:**
- python3 -m venv .venv && source .venv/bin/activate (or .venv/Scripts/activate on Windows); pip install requests
- pip freeze > requirements.txt, deactivate, recreate the venv from requirements.txt in a clean dir
- Show that the system python3 doesn't see 'requests' but the venv one does

**✅ Self-check:**
- Why is breaking the SYSTEM Python on CentOS 7 especially dangerous (hint: yum)?
- How do you reproduce an exact package set on another machine?

### 8.3 Error handling: try/except, exceptions, and not swallowing errors  _(3-4 hrs)_
**Learn:** try/except/else/finally handles failures (network, parse, auth) gracefully. Catch SPECIFIC exceptions (requests.exceptions.HTTPError, json.JSONDecodeError, openstack.exceptions.*), not bare except. Re-raise or log with context; never silently 'pass'. raise_for_status() turns 4xx/5xx into exceptions you can handle. This is exactly what keeps your Infra API returning a clean 4xx for bad caller input instead of leaking a 500.

**📚 Materials:**
- Python docs: 'Errors and Exceptions' tutorial (docs.python.org/3/tutorial/errors.html)
- Real Python: 'Python Exceptions: An Introduction' (realpython.com/python-exceptions/)
- openstacksdk docs: exceptions reference (docs.openstack.org/openstacksdk/latest/)

**🔧 Hands-on:**
- Wrap json.loads of malformed text in try/except json.JSONDecodeError and print a helpful message
- Call requests.get on a bad URL; handle requests.exceptions.ConnectionError vs HTTPError separately
- Write a function that returns clean 'bad request' info on a 400 but re-raises on a 500 (mirror the triage rule)

**✅ Self-check:**
- Why is 'except Exception: pass' dangerous in infra code?
- How do you convert a caller's bad input into a clean 4xx instead of letting it become a 500?

### 8.4 The requests library (calling REST APIs from Python)  _(4-5 hrs)_
**Learn:** requests is the standard HTTP client: requests.get/post/put/patch/delete, params=, json=, headers=, auth=, timeout= (ALWAYS set a timeout — without one a hung server hangs your script forever), r.status_code, r.json(), r.raise_for_status(), and Session() for reusing auth headers and connection pooling. This is how you'd hand-call Keystone/Nova before adopting the SDK.

**📚 Materials:**
- requests docs: 'Quickstart' and 'Advanced Usage' (requests.readthedocs.io)
- Real Python: 'Python's Requests Library (Guide)' (realpython.com/python-requests/)
- requests docs: 'Authentication' page

**🔧 Hands-on:**
- Use requests to GET https://httpbin.org/json, call .json(), and print a nested value
- POST a JSON body with json=... and a bearer header; print r.status_code and r.json()
- Add timeout=5 + a try/except for requests.exceptions.Timeout; create a Session() that reuses an auth header

**✅ Self-check:**
- Why must you ALWAYS pass a timeout to requests in infra code?
- What's the difference between passing data= vs json= to requests.post (Content-Type and encoding)?

### 8.5 openstacksdk & python-openstackclient (the real tools for the new-plan work)  _(8-10 hrs)_
**Learn:** openstacksdk is the modern, unified Python library for OpenStack; clouds.yaml holds credentials per CLOUD (perfect for your TWO independent deployments as two named clouds). conn = openstack.connect(cloud='cloudA'); conn.compute.create_flavor(name=, ram=, vcpus=, disk=); conn.compute.create_flavor_extra_specs(flavor, {...}); conn.block_storage.create_type(name=). The 'openstack' CLI (python-openstackclient) sits on the same SDK. KEY FLAVOR TRAPS: 'disk' is the root-disk size in GB and disk=0 is a special value meaning 'use the image/volume size, no Nova-imposed root disk' — set it deliberately, not by accident. extra_specs values are STRINGS and drive scheduling/quotas (e.g. 'quota:disk_read_iops_sec', 'hw:cpu_policy') — wrong key or wrong type silently changes behavior. For a BOOT-FROM-VOLUME plan the Cinder volume type (and its size), not the flavor disk, governs the root volume.

**📚 Materials:**
- openstacksdk docs (docs.openstack.org/openstacksdk/latest/) — User Guides + Compute / Block Storage proxy pages
- openstacksdk 'Configuration (clouds.yaml)' (docs.openstack.org/openstacksdk/latest/user/config/configuration.html)
- python-openstackclient docs (docs.openstack.org/python-openstackclient/latest/) — 'flavor' and 'volume type' command refs; Nova flavors concept page (docs.openstack.org/nova/latest/user/flavors.html)

**🔧 Hands-on:**
- On DevStack/lab: clouds.yaml with two named clouds; openstack --os-cloud cloudA flavor list
- Via openstacksdk: openstack.connect(cloud='cloudA'); create_flavor(name, ram, vcpus, disk); attach extra_specs; deliberately test disk=0 vs disk=20 and observe the difference
- Create a Cinder volume type via SDK/CLI; verify both with openstack flavor show / volume type show; repeat against cloudB to prove the two clouds are independent

**✅ Self-check:**
- What does flavor disk=0 mean, and when is it the right choice vs a footgun?
- For a boot-from-volume VPS plan, what governs the root disk size — the flavor's disk or the Cinder volume type? And how does clouds.yaml target both clouds?

### 8.6 Verifying KVM/host capacity before you sell the plan  _(4-5 hrs)_
**Learn:** A flavor is a PROMISE of resources; before offering it you must confirm the hypervisors can actually back it. Query hypervisor stats (openstack hypervisor stats show / conn.compute.hypervisors) for vcpus vs vcpus_used and free RAM/disk — but understand OVERCOMMIT: Nova's cpu_allocation_ratio and ram_allocation_ratio mean 'used' can exceed physical, so capacity is a scheduling question, not a raw subtraction. On the host itself, KVM is the in-kernel virtualization MODULE (kvm + kvm_intel/kvm_amd); QEMU is the userspace device emulator; libvirt is the management API Nova drives — in libvirt the hypervisor 'type' is reported as 'kvm' (QEMU+KVM), distinct from plain software-emulated 'qemu'. Confirm hardware virt is on (grep -E 'vmx|svm' /proc/cpuinfo; lsmod | grep kvm) so guests aren't silently running slow software emulation.

**📚 Materials:**
- OpenStack Nova docs: 'Hypervisors', 'Flavors', and 'Overcommitting CPU and RAM' / cpu_allocation_ratio (docs.openstack.org/nova/latest/admin/)
- libvirt docs: domain XML <domain type='kvm'> vs 'qemu', and the KVM project pages (linux-kvm.org, libvirt.org)
- python-openstackclient: 'hypervisor' command ref (docs.openstack.org/python-openstackclient/latest/)

**🔧 Hands-on:**
- openstack hypervisor stats show and openstack hypervisor list on the lab; note vcpus, vcpus_used, memory_mb_used
- On a lab KVM host: grep -E -c 'vmx|svm' /proc/cpuinfo and lsmod | grep kvm to confirm hardware virtualization + module loaded
- Compute, on paper, how many of your new-plan flavors fit given physical cores/RAM AND the configured allocation ratios — explain why the answer is a range, not a single number

**✅ Self-check:**
- What are the distinct roles of KVM (kernel module), QEMU (userspace), and libvirt, and what does 'type=kvm' vs 'type=qemu' indicate?
- Why can't you compute capacity by simply subtracting used from physical, and what config decides the real headroom?

## 9. 4B-9: Git in depth
*Why it matters:* All Infra API code, Ansible playbooks, and IaC live in Git and ship through pull requests + review — that's the gate that protects prod and the contract. You must branch, diff, review, revert, and (critically) keep secrets and tokens OUT of history.

### 9.1 Core model: commits, branches, remotes, the three areas  _(5-6 hrs)_
**Learn:** Git tracks snapshots (commits) on branches; the flow is working dir -> staging (index) -> repository (add -> commit). Remotes (origin) sync via push/pull/fetch. A branch is a cheap movable POINTER to a commit; you isolate work on a feature branch off main. Understanding the DAG (directed acyclic graph) of commits is what makes everything else click.

**📚 Materials:**
- Book: 'Pro Git' 2nd ed (Chacon & Straub, free at git-scm.com/book) — chapters 2 & 3 (Basics, Branching)
- Official Git reference (git-scm.com/docs)
- 'Learn Git Branching' interactive (learngitbranching.js.org) — free visual practice

**🔧 Hands-on:**
- git init a repo, make 3 commits, git log --oneline --graph to see the DAG
- Create a branch, commit on it, switch back, merge it; observe the graph
- Complete the 'Introduction Sequence' on learngitbranching.js.org

**✅ Self-check:**
- What are the three areas a file moves through before it's in a commit?
- What actually IS a branch in Git's data model (it's just a...)?

### 9.2 Inspecting history: log, diff, blame, show  _(3-4 hrs)_
**Learn:** git log (with --oneline/--graph/-p) reads history; git diff compares working/staged/commits; git blame shows which commit/author last changed each line — vital for understanding inherited Ansible; git show <commit> inspects one change. These are your forensic tools on legacy code.

**📚 Materials:**
- Pro Git ch.2 'Viewing the Commit History' + ch.7 'Git Tools'
- man git-log, man git-diff, man git-blame
- Atlassian Git tutorials: 'git log', 'git blame' (atlassian.com/git/tutorials)

**🔧 Hands-on:**
- On a real inherited-style repo: git blame an Ansible playbook to find who introduced a risky task and when
- git log -p -- path/to/file to read the full change history of one file
- git diff main..feature to preview exactly what a branch changes

**✅ Self-check:**
- How do you find the commit (and author) that last changed a specific line of a playbook?
- What's the difference between git diff, git diff --staged, and git diff main..branch?

### 9.3 Branching workflow + Pull Requests & code review  _(5-6 hrs)_
**Learn:** Feature-branch -> push -> open a PR -> review -> CI passes -> merge. PRs are where the contract gets scrutinized and where the Backend engineer reviews seam changes. Learn to write a clear PR description, request review, respond to comments, and keep PRs small. Know the merge strategies (merge commit vs squash vs rebase) and how to resolve conflicts.

**📚 Materials:**
- GitHub Docs: 'About pull requests' + 'Reviewing changes in pull requests' (docs.github.com/pull-requests)
- Pro Git ch.3 (Branching Workflows) + ch.6 (GitHub)
- Google Engineering Practices: 'How to do a code review' (google.github.io/eng-practices/review/)

**🔧 Hands-on:**
- Fork/clone a sandbox repo, branch, push, open a PR with a clear description, request a review
- Create and resolve a merge conflict deliberately between two branches
- Do a real review pass on a peer's PR using GitHub line comments + 'Request changes'/'Approve'

**✅ Self-check:**
- Why are small PRs easier and safer to review than one giant one?
- What should a PR description tell a reviewer about a contract change?

### 9.4 Undoing safely: revert vs reset, and recovery  _(3-4 hrs)_
**Learn:** git revert makes a NEW commit that undoes a previous one (safe, history-preserving — use this on shared/main). git reset moves the branch pointer (rewrites history — only on PRIVATE, unpushed branches). git restore/checkout for files; git reflog to recover 'lost' commits. Rule: on anything already pushed/shared, prefer revert — rewriting shared history breaks everyone else's clone.

**📚 Materials:**
- Pro Git ch.2 'Undoing Things' + ch.7 'Reset Demystified'
- man git-revert, man git-reset, man git-reflog
- Atlassian tutorial: 'Undoing Changes' (atlassian.com/git/tutorials/undoing-changes)

**🔧 Hands-on:**
- Make a bad commit, git revert it, and confirm history shows both the bad and the undo commit
- Use git reset --soft vs --hard on a throwaway branch and observe the difference to the working dir
- 'Lose' a commit with reset --hard, then recover it via git reflog + git checkout/branch

**✅ Self-check:**
- Why is git revert (not reset) the right tool to undo a commit already pushed to main?
- Where do you look to recover a commit you accidentally reset away?

### 9.5 .gitignore & keeping secrets out of history  _(3-4 hrs)_
**Learn:** .gitignore prevents committing files (secrets, .venv, clouds.yaml, *.pem, .env) BEFORE they're tracked. But once a secret is committed it lives in HISTORY even after you delete the file — you must (1) ROTATE the secret immediately because it's already compromised, and (2) scrub history (git filter-repo, or BFG). Prevent with a pre-commit secret scanner (gitleaks). Non-negotiable given clouds.yaml / Keystone creds.

**📚 Materials:**
- GitHub Docs: 'Ignoring files' + 'Removing sensitive data from a repository' (docs.github.com)
- github/gitignore repo (github.com/github/gitignore) — canonical templates incl. Python
- gitleaks (github.com/gitleaks/gitleaks) + pre-commit framework (pre-commit.com) for scanning on commit

**🔧 Hands-on:**
- Write a .gitignore covering .venv/, clouds.yaml, *.pem, .env, *.key; verify git status no longer lists them
- Install gitleaks; run 'gitleaks detect' on a repo; plant a fake token and watch it get caught
- On a THROWAWAY repo, remove an accidentally-committed secret from history with git filter-repo — and note you'd ALSO rotate the credential

**✅ Self-check:**
- A token was committed yesterday and you deleted the file today — is the token safe? What TWO steps are required (and which comes first)?
- Which infra files must always be in .gitignore for this role?

## 10. 4B-10: Ansible — the INHERITED system
*Why it matters:* Your CentOS-7 fleet is managed by Ansible you didn't write. You must read inventories/playbooks/roles, change them safely, and run them without nuking prod. This is the daily mechanism for both keeping the fleet alive and executing the CentOS-7 modernization.

### 10.1 Ansible mental model: control node, inventory, modules, idempotency  _(4-5 hrs)_
**Learn:** Ansible is agentless: a control node SSHes to managed hosts and runs MODULES that are (ideally) idempotent — they declare desired state, so a re-run changes nothing if the state already matches. Inventory lists hosts/groups; modules (yum/dnf, copy, service/systemd, template) do the work. Caveat: idempotency is a PROPERTY of well-written modules, NOT a guarantee — the command and shell modules just run a command and report 'changed' every time unless you add creates:/removes: or changed_when:. So 'idempotent' depends on how a task is written.

**📚 Materials:**
- Ansible docs: 'Getting started' + 'How Ansible works' (docs.ansible.com/ansible/latest/getting_started/)
- Book: 'Ansible for DevOps' (Jeff Geerling, ansiblefordevops.com) — early chapters
- Jeff Geerling YouTube: 'Ansible 101' series

**🔧 Hands-on:**
- Build a lab inventory of 2-3 throwaway VMs; ansible all -m ping to confirm connectivity
- ansible all -m setup to dump facts; ansible all -m command -a 'uptime'
- Run a 'copy a file' module twice (idempotent -> second run 'ok'); then run a 'shell' task twice and watch it report 'changed' every time

**✅ Self-check:**
- Why is 'agentless over SSH' significant operationally?
- Which two modules are NOT idempotent by default, and how do you make them idempotent?

### 10.2 Inventory: static, groups, group_vars/host_vars, --limit  _(3-4 hrs)_
**Learn:** Inventory (INI or YAML) defines hosts and groups (e.g. [hypervisors], [centos7]); group_vars/ and host_vars/ hold per-group/host variables with a defined PRECEDENCE. --limit narrows a run to one host or group — your single most important safety lever to avoid touching the whole fleet.

**📚 Materials:**
- Ansible docs: 'How to build your inventory' (docs.ansible.com/ansible/latest/inventory_guide/)
- Ansible docs: 'Using variables' — variable precedence (group_vars/host_vars)
- Ansible for DevOps — inventory chapter

**🔧 Hands-on:**
- Write an inventory with groups + group_vars; ansible -i inv hypervisors --list-hosts to verify membership
- Run a harmless playbook with --limit one-host and confirm only that host is touched
- Override a variable in host_vars for one host and prove it takes effect with a debug task

**✅ Self-check:**
- How does --limit protect you when changing inherited playbooks?
- Where would you set a variable that should apply to ALL hypervisors but not other hosts, and what wins on a precedence conflict?

### 10.3 Playbooks, plays, tasks, handlers, modules  _(5-6 hrs)_
**Learn:** A playbook (YAML) has plays that map tasks (each a module call) to hosts; handlers run on 'notify' AFTER a change and only if notified (e.g. restart Apache only if its config actually changed). Learn task structure, name:, become: (privilege escalation/sudo), loops, conditionals (when:), and tags. Read the inherited playbooks fluently before editing them. Note: handlers by default run at the END of the play, not immediately.

**📚 Materials:**
- Ansible docs: 'Working with playbooks' + 'Handlers: running operations on change' (docs.openstack URL is wrong — use docs.ansible.com/ansible/latest/playbook_guide/)
- Ansible builtin module index (docs.ansible.com/ansible/latest/collections/ansible/builtin/) — yum/dnf, copy, template, service/systemd
- Ansible for DevOps — playbooks chapter

**🔧 Hands-on:**
- Write a small playbook: install a package (yum on EL7 / dnf on EL8+), drop a config via template, notify a handler to restart the service
- Add a 'when:' conditional so a task runs only on the centos7 group
- Read an inherited-style playbook and annotate each task with what it does and its blast radius

**✅ Self-check:**
- What triggers a handler, when does it run, and why is that better than always restarting a service?
- How do become: and when: change a task's behavior?

### 10.4 Roles, Jinja2 templates & variables  _(5-6 hrs)_
**Learn:** Roles package reusable automation (tasks/, templates/, defaults/, vars/, handlers/, files/) for sharing/structure. Jinja2 templates ({{ var }}, {% if %}, {% for %}) render config files from variables (e.g. an Apache vhost per host). Variable precedence matters: defaults/main.yml is the LOWEST precedence (easily overridden), while vars/main.yml is high precedence (hard to override) — that's the practical difference.

**📚 Materials:**
- Ansible docs: 'Roles' + 'Templating (Jinja2)' (docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html)
- Jinja2 docs: 'Template Designer Documentation' (jinja.palletsprojects.com)
- Ansible Galaxy (galaxy.ansible.com) to study real role structures

**🔧 Hands-on:**
- ansible-galaxy init myrole; populate tasks/main.yml + a templates/ file; use it from a playbook
- Write a Jinja2 template that renders one config line per host using a list variable and {% for %}
- Explore one inherited role and diagram how defaults/vars/templates feed the rendered output

**✅ Self-check:**
- What's the practical precedence difference between defaults/main.yml and vars/main.yml?
- Show a Jinja2 snippet that loops a list to emit one line per item.

### 10.5 ansible-vault for secrets  _(3-4 hrs)_
**Learn:** ansible-vault encrypts secrets (passwords, API creds, clouds.yaml values) AT REST in the repo so they're safe to commit. Encrypt whole files or single vars (encrypt_string); decrypt at runtime with --ask-vault-pass or a vault password FILE (which itself stays out of Git). This is how secrets live in IaC without leaking — the encrypted blob is committable, the vault password is not.

**📚 Materials:**
- Ansible docs: 'Protecting sensitive data with Ansible Vault' (docs.ansible.com/ansible/latest/vault_guide/)
- Jeff Geerling: Ansible Vault tutorial (ansiblefordevops.com + Ansible 101 video)
- man ansible-vault

**🔧 Hands-on:**
- ansible-vault create secrets.yml; put a fake password in it; commit it and confirm it's ciphertext in git
- ansible-vault encrypt_string 'supersecret' --name 'db_pass' and embed the output in a vars file
- Run a playbook referencing the vaulted var using --vault-password-file (the password file is gitignored)

**✅ Self-check:**
- Why is a vault-encrypted secret safe to commit while a plaintext one is not?
- Where must the vault PASSWORD live (and not live)?

### 10.6 Running SAFELY: --check dry-run, --diff, --limit, and the caveats  _(4-5 hrs)_
**Learn:** --check is a dry run (predict changes, change nothing); --diff shows the textual change; --limit scopes to one host; -v/-vvv add detail. CRITICAL CAVEATS: --check is NOT reliable for all tasks — command/shell and many custom modules either skip in check mode or can't truly predict their effect, and a task that depends on a PRIOR (skipped-in-check) change will mis-predict downstream. So: always test on a LAB MIRROR first, then run on ONE real host with --limit, watch, then widen. Never run an inherited playbook fleet-wide blind. Also useful: --start-at-task and --step to advance carefully.

**📚 Materials:**
- Ansible docs: 'Validating tasks: check mode and diff mode' (docs.ansible.com/ansible/latest/playbook_guide/playbooks_checkmode.html) — read the limitations explicitly
- Ansible docs: 'Patterns: targeting hosts and groups' (--limit) + 'Start and step' (--start-at-task, --step)
- Jeff Geerling: 'Ansible best practices' blog/talks (check mode & safety)

**🔧 Hands-on:**
- ansible-playbook site.yml --check --diff --limit one-lab-host and read the predicted changes WITHOUT applying
- Find a command/shell task in the inherited playbook and reason about why --check can't truly predict it
- Adopt a personal runbook: lab mirror -> --check --diff -> --limit single host -> observe -> widen scope

**✅ Self-check:**
- Name two situations where --check gives MISLEADING or skipped results.
- What is your step-by-step safe procedure to apply an inherited playbook change to prod?

## 11. 4B-11: Integration & contract testing across the Infra API seam
*Why it matters:* This operationalizes 4A-5. The whole point is to catch a breaking change to the Infra API in CI — before it reaches the Backend engineer's Control Panel in prod. You'll mock the API, run against shared staging, and add schema/contract checks that FAIL the build on a breaking change.

### 11.1 Test levels: unit vs integration vs contract vs end-to-end  _(3-4 hrs)_
**Learn:** Unit tests a function in isolation; integration tests components together (your code <-> a real-ish dependency); contract tests verify the SEAM's promise specifically; e2e exercises the whole flow. For the seam, contract + integration are king. Know what each catches and what it can't (a passing unit test says nothing about whether you renamed a response field the Control Panel reads).

**📚 Materials:**
- Martin Fowler: 'TestPyramid', 'IntegrationTest', and 'ContractTest' articles (martinfowler.com)
- Book: 'Python Testing with pytest' 2nd ed (Brian Okken, Pragmatic) — intro chapters
- pytest docs: 'Get Started' (docs.pytest.org)

**🔧 Hands-on:**
- Write a pytest unit test for your flavor_summary() function (assert formatting)
- Sketch on paper which seam bugs a unit test would MISS that a contract test catches
- Run pytest -v on a small test file and read the output

**✅ Self-check:**
- What kind of bug does a contract test catch that a unit test cannot?
- Where does the seam between you and the Backend engineer sit in the test pyramid?

### 11.2 Mocking the Infra API (so each side tests independently)  _(4-5 hrs)_
**Learn:** The Backend engineer can develop against a MOCK of your Infra API (and vice versa) so neither blocks the other. Tools: Prism (mock server generated from your OpenAPI spec), WireMock, or the Python 'responses'/'respx' libraries to fake HTTP inside tests. The mock must mirror the CONTRACT, which is why the OpenAPI spec (4A-6) is the source of truth — a spec-driven mock can't drift from the contract.

**📚 Materials:**
- Stoplight Prism (github.com/stoplightio/prism) — 'prism mock openapi.yaml' serves a mock from your spec
- Python 'responses' (github.com/getsentry/responses) for requests, or 'respx' for httpx
- WireMock docs (wiremock.org/docs/) as an alternative

**🔧 Hands-on:**
- prism mock your-infra-api.yaml and curl the mock endpoints; confirm responses match the spec
- In pytest, use 'responses' to mock a 200 and a 400 from the Infra API and assert your client handles both
- Change a field name in the spec, re-run the mock, and see the mock's response change (spec is the source of truth)

**✅ Self-check:**
- Why can a mock generated FROM the OpenAPI spec keep both engineers unblocked AND honest to the contract?
- How would you mock a 401 to test your client's re-auth path?

### 11.3 Schema/contract checks that fail CI on a breaking change  _(5-6 hrs)_
**Learn:** Add CI steps that validate: (a) the OpenAPI spec is well-formed and lint-clean, and (b) the NEW spec is backward-COMPATIBLE with the old one (a diff tool flags breaking changes). Tools: oasdiff (detects breaking changes between two specs), Spectral (lints the spec), schemathesis (property-based fuzzing of the RUNNING API against its spec). A breaking diff => non-zero exit => build fails => the seam is protected.

**📚 Materials:**
- oasdiff (github.com/oasdiff/oasdiff — formerly Tufin/oasdiff) — breaking-change detection between two OpenAPI specs
- Spectral (github.com/stoplightio/spectral) — OpenAPI/JSON linter
- schemathesis (schemathesis.readthedocs.io) — property-based testing against an OpenAPI spec
- Pact / consumer-driven contract testing intro (docs.pact.io) — for the deeper CDC approach

**🔧 Hands-on:**
- oasdiff breaking old-spec.yaml new-spec.yaml AFTER renaming a field; confirm it reports a BREAKING change and exits non-zero
- Add 'oasdiff breaking' as a CI step that exits non-zero on breaking changes (so the PR is blocked)
- Run schemathesis against your mock/staging API to find responses that violate the spec

**✅ Self-check:**
- Which tool blocks a PR that renames a response field, and what exit behavior makes it a gate?
- What's the difference between LINTING a spec (Spectral) and DIFFING two specs for breakage (oasdiff)?

### 11.4 Shared staging & coordinating a contract change with the other engineer  _(4-5 hrs)_
**Learn:** A shared staging environment runs both sides against real (non-prod) services for integration confidence. The HUMAN process: announce the contract change, agree a version (4A-5), land it behind a version, both deploy to staging, verify, then roll to prod with a migration window. CI + staging + communication together prevent the surprise breakage — tooling alone is not enough.

**📚 Materials:**
- Martin Fowler: 'ContinuousIntegration' + 'ConsumerDrivenContracts' articles (martinfowler.com)
- Pact docs: 'How Pact works' (consumer/provider, can-i-deploy) (docs.pact.io)
- GitHub Docs: 'Using environments for deployment' (staging/promotion) (docs.github.com/actions)

**🔧 Hands-on:**
- Write a 1-page change protocol: who announces, where the spec PR lives, who approves, staging sign-off, prod window
- Simulate it: open a spec PR with a backward-compatible change, get the (mock) Backend engineer to approve, 'deploy' to a staging docker-compose, run integration tests
- Run a 'can-i-deploy'-style check: confirm both consumer and provider agree on the contract version before promoting

**✅ Self-check:**
- What three things together (tooling + environment + process) keep a contract change from breaking prod?
- Why land a breaking change behind a NEW version BEFORE the consumer migrates, not after?

## 12. 4B-12: IaC awareness (Terraform OpenStack vs Heat; provisioning vs config mgmt)
*Why it matters:* You should recognize Infrastructure-as-Code options around OpenStack so you can read existing IaC and choose the right tool: provisioning (create the VM/network/volume/flavor) vs config management (configure what's inside the host). This frames where Ansible (config) ends and Terraform/Heat (provisioning) begin for the new plan.

### 12.1 Provisioning IaC vs configuration management (the dividing line)  _(2-3 hrs)_
**Learn:** Provisioning tools (Terraform, OpenStack Heat) CREATE infrastructure (instances, networks, volumes, flavors) declaratively and track state. Config management (Ansible) configures the OS/services INSIDE existing hosts. They overlap (Ansible CAN provision, Terraform CAN run scripts) but the mental model — 'build the box' vs 'set up the box' — guides tool choice and explains your inherited Ansible's scope.

**📚 Materials:**
- HashiCorp: 'What is Infrastructure as Code?' + 'Terraform vs. alternatives' (developer.hashicorp.com/terraform/intro)
- Book: 'Terraform: Up & Running' 3rd ed (Yevgeniy Brikman, O'Reilly) ch.1
- Red Hat / HashiCorp 'Ansible vs Terraform' comparison articles (verify URL)

**🔧 Hands-on:**
- Make a two-column table classifying tasks (create a volume, install httpd, define a flavor, restart a service) as provisioning vs config
- Read the intro of 'Terraform: Up & Running' and write the one-line difference in your own words
- Identify in your inherited setup which tasks are config-mgmt (Ansible) and which are/should be provisioning

**✅ Self-check:**
- Which category does 'create a Cinder volume type' fall into, and which tool fits?
- Why might you use Terraform AND Ansible together rather than one alone?

### 12.2 Terraform OpenStack provider (declarative state)  _(4-5 hrs)_
**Learn:** Terraform uses HCL to declare resources; the terraform-provider-openstack creates compute/network/blockstorage resources against your cloud (it reads the same clouds.yaml / OS_ env vars). Core loop: init -> plan (preview, analogous to Ansible --check) -> apply; the STATE file tracks reality and is the source of truth Terraform diffs against. You need recognition, not mastery: read a .tf file, run a plan, understand state and the danger of a careless 'apply' (and that state can drift if someone changes things out-of-band).

**📚 Materials:**
- Terraform OpenStack provider docs (registry.terraform.io/providers/terraform-provider-openstack/openstack/latest/docs)
- HashiCorp 'Terraform: Get Started' tutorials (developer.hashicorp.com/terraform/tutorials)
- 'Terraform: Up & Running' ch.2-3 (basic syntax, state)

**🔧 Hands-on:**
- On lab/DevStack: write a tiny .tf using the openstack provider to declare one network or volume; terraform init && terraform plan
- terraform apply it, then terraform show the state; then terraform destroy
- Read terraform plan output and map each +/-/~ to what Ansible --check would tell you

**✅ Self-check:**
- What does terraform plan correspond to in the Ansible world?
- Why is the Terraform STATE file sensitive (it can contain secrets) and important to protect/lock?

### 12.3 OpenStack Heat (HOT templates) — the native option  _(3-4 hrs)_
**Learn:** Heat is OpenStack's NATIVE orchestration service: a HOT template (Heat Orchestration Template, YAML) describes a 'stack' of resources (servers, volumes, networks) that Heat creates/updates/deletes together, with state tracked SERVER-SIDE in OpenStack itself. Compare to Terraform: Heat is built-in and OpenStack-only (state lives in the cloud, no separate state file); Terraform is multi-cloud and keeps its own state file. Recognize a HOT template and the stack lifecycle (create/update/delete).

**📚 Materials:**
- OpenStack Heat docs: 'Heat Orchestration Template (HOT) specification' + Heat user guide (docs.openstack.org/heat/latest/)
- OpenStack docs: Heat 'Getting Started' / creating your first stack (docs.openstack.org/heat/latest/getting_started/)
- openstack 'stack' CLI reference (python-openstackclient)

**🔧 Hands-on:**
- On lab: write a minimal HOT template declaring one resource; openstack stack create -t template.yaml mystack
- openstack stack list / stack show / stack delete to see the lifecycle
- Diff a HOT template vs an equivalent .tf snippet and list pros/cons for your two-independent-cloud reality

**✅ Self-check:**
- What's one advantage of Heat over Terraform for an OpenStack-only shop (e.g. server-side state), and one advantage the other way (multi-cloud)?
- What is a 'stack' in Heat, and where does Heat keep its state vs where Terraform keeps it?

## 13. 4B-13: CI/CD basics
*Why it matters:* CI is the gate that runs your contract checks/tests on every PR (protecting the seam and prod); CD automates deploys (which may run ansible-playbook or terraform apply). The cardinal rule for an infra owner: never apply to prod from your laptop — let a reviewed, audited pipeline do it.

### 13.1 CI fundamentals: gates on merge  _(4-5 hrs)_
**Learn:** Continuous Integration runs automated checks (lint, unit/integration/contract tests, spec diff) on every push/PR; a failing REQUIRED check BLOCKS the merge (branch protection + required status checks). This is where 4B-11's oasdiff/spectral/schemathesis/pytest become ENFORCEMENT, not suggestions. A check is only a true gate if it's marked required on the protected branch.

**📚 Materials:**
- Martin Fowler: 'ContinuousIntegration' article (martinfowler.com/articles/continuousIntegration.html)
- GitHub Actions docs: 'Understanding GitHub Actions' + 'Building and testing Python' (docs.github.com/actions)
- GitHub Docs: 'About protected branches' / required status checks (docs.github.com)

**🔧 Hands-on:**
- Add .github/workflows/ci.yml that runs pytest + spectral lint + oasdiff on every PR
- Enable branch protection requiring that workflow to pass before merge; open a failing PR and confirm it's blocked
- Make the contract check fail (rename a field) and watch CI go red and block the merge

**✅ Self-check:**
- What makes a CI check a true 'gate' rather than just informational?
- Which 4B-11 checks belong in CI to protect the Infra API contract?

### 13.2 CD basics: pipelines that run ansible-playbook / terraform apply  _(4-5 hrs)_
**Learn:** Continuous Delivery/Deployment promotes a passing build through environments (staging -> prod), often by running ansible-playbook or terraform apply FROM the pipeline (not a human laptop). Add MANUAL APPROVAL gates for prod, environment-scoped secrets (not committed), and audit logs. Crucially, the SAFE-RUN habits from 4B-10 (--limit, --check, lab-first) apply INSIDE the pipeline too — automation doesn't excuse you from scoping and previewing.

**📚 Materials:**
- Jez Humble & Dave Farley: 'Continuous Delivery' (continuousdelivery.com) + Martin Fowler 'ContinuousDelivery'
- GitHub Actions docs: 'Using environments for deployment' (required reviewers/approvals) + 'Using secrets in GitHub Actions'
- Ansible docs / Jeff Geerling: running Ansible in CI/CD pipelines

**🔧 Hands-on:**
- Extend the workflow with a 'deploy' job gated behind a manual approval (environment with required reviewer)
- Have the deploy job run ansible-playbook --check --limit staging-host against a LAB inventory (NOT prod)
- Store the vault password / cloud creds as encrypted GitHub Actions secrets referenced by the job, never in the repo

**✅ Self-check:**
- Why should terraform apply / ansible-playbook against prod run from a pipeline, not your laptop?
- What guardrails (approval, scope, secrets, audit) must a prod CD job have?

### 13.3 The cardinal rule & putting the pipeline together for the new plan  _(4-5 hrs)_
**Learn:** Synthesize the whole phase: a change to the Infra API (new-plan flavor/volume-type support) flows as branch -> PR -> CI (tests + contract diff) -> review by Backend engineer -> merge -> CD to staging -> verify -> APPROVED prod deploy. Never bypass: no laptop prod applies, no merging red builds, no silent breaking changes. This is the end-to-end safety system for your role.

**📚 Materials:**
- Book: 'The DevOps Handbook' (Kim/Humble/Debois/Willis) + 'The Phoenix Project' (Kim/Behr/Spafford) — why these guardrails exist (narrative/context)
- Google SRE Book: 'Release Engineering' chapter (free at sre.google/sre-book/release-engineering/)
- Martin Fowler: 'DeploymentPipeline' (martinfowler.com/bliki/DeploymentPipeline.html)

**🔧 Hands-on:**
- Draw the full pipeline for shipping the new VPS plan's Infra API change, labeling each gate and who/what approves it
- Write a checklist that makes 'apply to prod from a laptop' impossible BY POLICY (branch protection + environment approvals + secrets only in CI)
- Dry-run the whole flow in a sandbox repo: PR -> CI green -> review -> merge -> staging deploy job -> manual-approve prod job (targeting lab, not real prod)

**✅ Self-check:**
- Trace a new-plan Infra API change from your branch to prod, naming every gate.
- State the cardinal rule of CD for an infra owner in one sentence and explain why.

## 🎯 Phase capstone
Ship the new VPS plan's Infra-API seam end-to-end, safely, on a LAB MIRROR (DevStack or an all-in-one OpenStack), never prod. Concretely: (1) Using openstacksdk with a TWO-CLOUD clouds.yaml (your two deployments are independent clouds with separate Keystones — prove it by showing a token from cloudA is rejected by cloudB), write a Python script that creates the new plan's OpenStack flavor (vcpus/ram/disk + extra_specs) and a matching Cinder volume type, setting flavor disk deliberately (explain your disk=0 vs disk=N choice for boot-from-volume), and VERIFIES host capacity (query hypervisor stats AND account for cpu/ram allocation ratios; confirm KVM hardware-virt is active via /proc/cpuinfo + lsmod) before declaring success — with proper try/except so bad input yields a clean 4xx-style error, not a crash. (2) Author an OpenAPI 3 spec for ONE new Infra-API endpoint exposing the plan (e.g. POST /plans or GET /flavors/{id}), serve it as a Prism mock, and write a requests-based client + pytest tests (including a mocked 401 re-auth path and a mocked 400 bad-input path). (3) Put it all in Git on a feature branch with a clean .gitignore (clouds.yaml, *.pem, .venv) and a gitleaks pre-commit hook; open a PR with a contract-change description. (4) Add a GitHub Actions CI workflow that runs pytest, Spectral lint, and oasdiff breaking-change detection against the previous spec — and PROVE it blocks a merge when you rename a response field (a breaking change exits non-zero). (5) Write/extend an Ansible role (with an ansible-vault'd secret) that would register/roll out the plan config, and demonstrate the safe-run runbook: lab mirror -> ansible-playbook --check --diff --limit one-host -> observe -> widen, calling out one task where --check would mislead you. Deliverable: a working demo PLUS a one-page 'contract change protocol' you'd hand the Backend engineer (announce -> versioned spec PR -> CI green -> staging -> prod window). Success = the new flavor + volume type exist on the lab cloud, capacity was verified with overcommit reasoning, the CI gate visibly fails on a breaking change, and nothing was ever applied to prod from your laptop.

## 🧰 Primary resources for this phase
- MDN Web Docs — HTTP section (developer.mozilla.org/en-US/docs/Web/HTTP): the canonical, free, beginner-friendly reference for methods, headers, and status codes (foundation for 4A-1..4)
- OpenStack official docs (docs.openstack.org): the api-ref portal, openstacksdk + clouds.yaml config guide, python-openstackclient, Keystone/Nova/Cinder/Heat guides, and the Nova flavors + overcommit admin pages — your real production targets for flavors, volume types, auth, capacity, and IaC
- 'Pro Git' by Chacon & Straub — free at git-scm.com/book: authoritative Git from data model to PR workflows (4B-9)
- Ansible documentation (docs.ansible.com) + 'Ansible for DevOps' by Jeff Geerling (ansiblefordevops.com) and his 'Ansible 101' YouTube series: the inherited-system skills — inventory, roles, vault, and especially check-mode safety and its limitations (4B-10)
- 'The Design of Web APIs' (Arnaud Lauret, Manning) for the API CONTRACT/versioning spine (4A-5), plus the OpenAPI Specification + Swagger Editor (editor.swagger.io) for writing/reading the contract (4A-6), and the OpenStack API Microversions guide as the real-world versioning model
- Martin Fowler's articles — ContinuousIntegration, TestPyramid, ContractTest, DeploymentPipeline (martinfowler.com): the conceptual backbone for seam testing and CI/CD (4B-11, 4B-13); tooling: oasdiff, Spectral, schemathesis, Stoplight Prism, gitleaks

---

# Phase 5 — OpenStack Deep-Dive + Storage (ships the new plan)
**Duration:** 10-12 weeks part-time + 1-2 weeks DevStack setup tax (so budget 12-14 weeks total)

> This is THE phase where you stop being a learner and become the person who ships the new VPS plan. Everything you build a model of here — a flavor, a volume type, a quota, an allocation ratio — is a real lever you will pull in production on the two Kagoya OpenStack deployments. Approach it in two passes: first build a correct MENTAL MODEL of how the cooperating services talk to each other over REST APIs and the RabbitMQ message bus (control-plane vs data-plane), then prove every concept with your own hands in a throwaway DevStack you break and rebuild freely. The single most important habit to form: never trust a diagram you can't reproduce with a CLI command and a log line. Two facts to nail down before anything else and to keep written on your wall — (a) confirm Kagoya's actual hypervisor and storage from ground-truth (the marketed platform is OpenStack + KVM/QEMU on NVMe storage; note that 'KVM' is the in-kernel accelerator and QEMU/libvirt is the emulator/management layer Nova actually drives, so logs and virsh speak QEMU/libvirt, not 'KVM' commands), so your flavor/volume-type/QoS work lands on real hardware whose limits you must respect; and (b) the 'two systems' almost certainly mean two INDEPENDENT clouds with SEPARATE Keystones, so 'create the flavor in both' = two sets of credentials, two CLI runs, two verifications — NOT one multi-region command. Get the pre-step done first; it changes which exact doc version every later topic points at. One housekeeping note on resources: always read docs at docs.openstack.org/<service>/<your-release>/ matching the release you find in the Pre-step, not /latest/.

## 1. Pre-step: Fingerprint the two real deployments (release + install method)
*Why it matters:* Every doc page below has a per-release version. If you study 'latest' but prod runs Yoga, half your extra_specs and QoS flags may not exist or behave differently. And the install method (Kolla-Ansible vs OpenStack-Ansible vs TripleO/RDO vs distro packages) decides WHERE config files and logs live, how you restart a service, and how you safely add a flavor/volume type. This is the map you navigate by for the rest of the phase.

### 1.1 Identify OpenStack release of each deployment  _(3-4 hrs)_
**Learn:** Find the codename/version (e.g. Yoga, Zed, 2023.1 Antelope) of EACH of the two clouds, because API microversions, available extra_specs keys, and Cinder QoS options differ by release. The two clouds may even be on different releases. Note: codenames were alphabetical (Yoga, Zed) and then switched to year-based (2023.1 'Antelope', 2023.2 'Bobcat', ...).

**📚 Materials:**
- OpenStack Releases series page: docs.openstack.org/releases/ (maps codename<->date<->status, shows which are EOL/Unmaintained vs Maintained)
- python-openstackclient command reference for versions: docs.openstack.org/python-openstackclient/latest/ (search 'versions show')
- Nova REST API microversion history: docs.openstack.org/nova/latest/reference/api-microversion-history.html

**🔧 Hands-on:**
- On each cloud's admin node run: openstack --version (client version) and 'openstack versions show' (server-side API versions per service)
- On RPM hosts: rpm -qa | grep -iE 'nova|cinder' ; on DEB hosts: dpkg -l | grep -iE 'nova|cinder' — read the package version
- curl the Keystone root unauthenticated: curl -s http://<keystone-host>:5000/ | python3 -m json.tool — read the version/status block
- Record results in a 2-column table 'Cloud A / Cloud B' you reuse all phase: release codename, nova API microversion range, cinder version

**✅ Self-check:**
- What release does each cloud run, and is either one already in 'Unmaintained'/EOL status upstream (per the releases page)?
- Why must I read docs.openstack.org/<service>/<release>/ instead of /latest/ when looking up a flavor extra_spec or QoS key?
- If Cloud A is Yoga and Cloud B is 2023.1, where might a QoS or extra_specs key exist on one but not the other?

### 1.2 Identify the install/deployment method  _(4-6 hrs)_
**Learn:** Determine how each cloud was deployed — Kolla-Ansible (services in Docker/Podman containers), OpenStack-Ansible (LXC or metal), TripleO/RDO (Red Hat, containerized via director), or distro packages on bare metal. This dictates how you restart nova-api, where nova.conf actually lives (often a container bind-mount), and the SAFE way to add a flavor (always via API/CLI, never by editing the DB) vs the safe way to add a Cinder backend (a config change + an install-method-specific redeploy/reconfigure step).

**📚 Materials:**
- Kolla-Ansible docs: docs.openstack.org/kolla-ansible/latest/ (read the 'Operating Kolla' / reconfigure workflow)
- OpenStack-Ansible docs: docs.openstack.org/openstack-ansible/latest/
- TripleO deploy guide: docs.openstack.org/project-deploy-guide/tripleo-docs/latest/ (verify URL — TripleO is being superseded; for newer RHOSP use the Red Hat product docs at docs.redhat.com) and rdoproject.org
- Your own internal runbook / the senior engineer — the authoritative source for the EXACT approved restart and reconfigure commands in prod

**🔧 Hands-on:**
- Look for tell-tales: 'docker ps' or 'podman ps' showing nova_api/cinder_api containers => Kolla or TripleO; /etc/openstack_deploy/ + LXC containers => OpenStack-Ansible; /etc/kolla/ => Kolla; plain systemd units like openstack-nova-api => distro packages
- Locate the real config: find / -name nova.conf 2>/dev/null ; note whether it is a container bind-mount vs a host path
- Write down, per cloud, the EXACT approved command to (a) apply a config change and (b) restart a service — confirm with the runbook/senior engineer; do NOT guess in prod

**✅ Self-check:**
- For each cloud, what is the exact, approved command to safely apply a config change and restart a service?
- Why is adding a flavor safe via CLI on ANY install method, but adding a Cinder backend is an install-method-specific config+redeploy operation?
- If nova.conf is a bind-mount into a container, what mistake would editing it on the host directly without a reconfigure cause?

## 2. What OpenStack actually is (services + message bus)
*Why it matters:* You own the Infra API seam that calls OpenStack via REST. To debug 'the API call hangs' or 'instance stuck in BUILD', you must know which service owns which step and that internal components coordinate over RabbitMQ — a single operational failure point that can take the whole control plane down while existing VMs keep running.

### 2.1 Cooperating services over REST APIs (the project map)  _(3-4 hrs)_
**Learn:** OpenStack is not one program — it's a set of core services (Keystone identity, Glance images, Nova compute, Neutron networking, Cinder block storage, Placement inventory) plus Horizon (web UI), each with its own REST API and (mostly) its own DB, cooperating to deliver a VM. Know which service does what so you can route a problem to the right component and the right owner.

**📚 Materials:**
- OpenStack install guide 'Get started with OpenStack' / logical architecture: docs.openstack.org/install-guide/get-started-logical-architecture.html (verify URL — also reachable from docs.openstack.org/<release>/install/)
- Per-service landing pages on docs.openstack.org (keystone/, nova/, neutron/, cinder/, glance/, placement/) — each opens with a concepts/overview section
- OpenStack official YouTube channel (youtube.com/@openstack) and the OpenInfra Foundation channel for recorded talks/tutorials (search 'OpenStack architecture overview'; verify specific playlist before relying on it)

**🔧 Hands-on:**
- On DevStack run: openstack service list and openstack endpoint list — map each service to its API URL
- Draw the call graph for 'boot a VM' on paper: which services are touched and in what order
- openstack catalog list — see the same map from the token's point of view

**✅ Self-check:**
- Which service owns images, which owns networking, which owns block volumes, which owns the placement inventory used to schedule?
- If 'openstack server create' fails, name the first three services you'd suspect and why.

### 2.2 Control plane vs data plane  _(3-4 hrs)_
**Learn:** The control plane (APIs, schedulers, DBs, RabbitMQ) decides and records; the data plane (running VMs on the hypervisor, their network traffic, their disk I/O) actually carries customer workload. Critical operational truth: the control plane can be fully down (no new VMs, no API) while customer VMs keep running — and vice versa. This shapes what 'outage' means to a customer vs to you, and which monitoring alarm is which severity.

**📚 Materials:**
- OpenStack Operations Guide — architecture and maintenance chapters: docs.openstack.org/operations-guide/ (NOTE: community classic, last substantively updated ~2017 — excellent for operator mindset and concepts; verify specifics against current per-service docs)
- Nova System Architecture: docs.openstack.org/nova/latest/admin/architecture.html
- Keystone authentication overview (control-plane auth path): docs.openstack.org/keystone/latest/admin/ (Identity concepts)

**🔧 Hands-on:**
- On DevStack, stop nova-api (systemctl stop devstack@n-api, or the equivalent for your install) then confirm: existing VMs still ping (data plane alive) but 'openstack server create' fails (control plane down)
- Restart it and confirm new boots work again
- List every nova/cinder/neutron process you can see and label each: control-plane or data-plane

**✅ Self-check:**
- A customer says 'my server is up but I can't resize it' — is this primarily a control-plane or data-plane problem?
- Which plane does a RabbitMQ outage hit, and what exactly does the already-running customer VM experience during it?

### 2.3 RabbitMQ message bus as a failure point  _(4-5 hrs)_
**Learn:** Services don't only call each other over REST; internally Nova/Cinder/Neutron components talk via RPC over the RabbitMQ message bus (oslo.messaging). If RabbitMQ is unhealthy, nova-api can accept a request (HTTP 202) but nova-scheduler/nova-compute never receive the message — instances hang in BUILD or scheduling silently stalls. This is one of the most common real-world control-plane outages, and queue backlog is a key thing to alarm on.

**📚 Materials:**
- oslo.messaging docs: docs.openstack.org/oslo.messaging/latest/
- RabbitMQ official tutorials and management UI docs: rabbitmq.com/tutorials and rabbitmq.com/docs/management
- Nova troubleshooting docs (docs.openstack.org/nova/latest/admin/) and the Operations Guide 'Maintenance, Failures, and Debugging' chapter

**🔧 Hands-on:**
- On DevStack enable the rabbitmq_management plugin (rabbitmq-plugins enable rabbitmq_management), browse :15672, and watch queues during a 'server create'
- Simulate failure: stop rabbitmq-server, run 'openstack server create', observe it hang in BUILD; check the nova-compute/nova-scheduler logs for missing RPC; restart RabbitMQ and watch the queues drain and the build proceed
- rabbitmqctl list_queues name messages consumers — interpret what a backed-up queue (high messages, zero/few consumers) means

**✅ Self-check:**
- Why can nova-api return '202 Accepted' while the instance never actually builds?
- What single component, if its queues back up, can stall instance creation across the whole cloud, and what metric warns you early?

## 3. Keystone identity (the front door)
*Why it matters:* Your Infra API authenticates to OpenStack via Keystone on EVERY call. Customers map to Keystone projects; quotas and isolation hang off projects. To add a plan you'll create/modify flavors and volume types with an admin-scoped token, and to debug 'permission denied' you must read tokens, roles, and the service catalog.

### 3.1 Projects, users, roles, domains  _(3-4 hrs)_
**Learn:** A project (formerly 'tenant') is the unit of ownership and quota; a customer = a project. Users get roles (e.g. admin, member, reader) ON a project (or on the system). Domains namespace users/projects. Your admin operations need a role like 'admin' scoped correctly; a customer's resources live inside their project boundary.

**📚 Materials:**
- Keystone admin docs, start at 'Identity concepts': docs.openstack.org/keystone/latest/admin/
- Keystone 'Default roles' (admin/member/reader) doc: docs.openstack.org/keystone/latest/admin/ (search 'default roles')
- python-openstackclient command reference for project/user/role: docs.openstack.org/python-openstackclient/latest/

**🔧 Hands-on:**
- openstack project create demo-customer ; openstack user create --project demo-customer demo-user --password x ; openstack role add --user demo-user --project demo-customer member
- Source demo-user creds, try to list ALL projects (should fail) vs as admin (succeeds) — feel the boundary
- openstack role assignment list --names | grep demo

**✅ Self-check:**
- What Keystone object does a Kagoya customer correspond to, and where do their quotas attach?
- Why does my Infra API need an admin-scoped token to create a flavor but only a project-scoped token to boot a VM for one customer?

### 3.2 Tokens (the auth path) and scoping  _(3-4 hrs)_
**Learn:** Auth = exchange credentials (or an application credential) for a token that carries roles + a service catalog; the token is scoped (project / system / domain) or unscoped. Tokens expire. Your Infra API must obtain and refresh tokens; debugging 401 (bad/expired creds) vs 403 (authenticated but lacking the required role/scope) means inspecting the token's scope and roles. Project-scoped vs system-scoped matters: some admin operations are moving to system scope.

**📚 Materials:**
- Keystone token guide: docs.openstack.org/keystone/latest/admin/tokens-overview.html
- Identity API v3 reference: docs.openstack.org/api-ref/identity/v3/
- Application credentials: docs.openstack.org/keystone/latest/user/application_credentials.html

**🔧 Hands-on:**
- openstack token issue — read the expiry, project_id, and roles in the response
- curl Keystone v3 /auth/tokens with a JSON body, capture the X-Subject-Token header, then reuse it as X-Auth-Token on a Nova GET call
- Create an application credential (openstack application credential create) — the right pattern for an automated Infra API; note it can be restricted by role/expiry

**✅ Self-check:**
- What does a project-scoped token carry, and which part of it tells my code where to send the next request?
- For an always-running Infra API, why are application credentials safer than embedding a user password, and what's the difference between a 401 and a 403?

### 3.3 Service catalog & endpoints  _(2-3 hrs)_
**Learn:** After auth, the token's response includes a service catalog: for each service (nova, cinder, ...) the public/internal/admin endpoint URLs, tagged by region. Your code should DISCOVER endpoints from the catalog (via the SDK/keystoneauth), not hardcode them. Each cloud has its OWN catalog — this is the concrete mechanism that makes the two Kagoya clouds separate.

**📚 Materials:**
- Keystone service catalog overview: docs.openstack.org/keystone/latest/admin/ (search 'service catalog') and the contributor concept doc
- keystoneauth/openstacksdk endpoint-discovery docs: docs.openstack.org/keystoneauth/latest/
- python-openstackclient reference for 'catalog' and 'endpoint': docs.openstack.org/python-openstackclient/latest/

**🔧 Hands-on:**
- openstack catalog list and openstack endpoint list on BOTH clouds — note the URLs and region names differ
- Pull the catalog array out of a raw /auth/tokens response and identify the nova 'public' endpoint
- Compare Cloud A and Cloud B catalogs side by side to prove they are independent Keystones

**✅ Self-check:**
- Where does my Infra API learn the Nova URL for a given cloud — and why is hardcoding it a bug waiting to happen?
- If the two clouds have separate catalogs/Keystones, what does that imply for a 'create flavor in both' workflow?

## 4. Region vs AZ vs separate cloud (get this RIGHT)
*Why it matters:* This is the single most consequential conceptual trap for your two-deployment world. Mislabeling 'two clouds' as 'two regions' will make you write the wrong automation, share credentials that shouldn't be shared, and assume a single Keystone where there are two. Getting it right defines how you ship 'the flavor in both' and how you detect drift.

### 4.1 Region = a label within ONE shared Keystone catalog  _(2-3 hrs)_
**Learn:** A true multi-REGION cloud has ONE Keystone (and usually one Horizon) shared across regions; each region runs its own Nova/Neutron/Cinder and appears as a region label in the SAME service catalog. You auth once and select a region (e.g. --os-region-name). This is NOT the same as two separate clouds with separate Keystones.

**📚 Materials:**
- Nova/Keystone region concepts in the Operations Guide 'Architecture' chapter: docs.openstack.org/operations-guide/ (concepts only; dated)
- Keystone admin docs on regions and catalog: docs.openstack.org/keystone/latest/admin/
- 'OpenStack Partitions: Regions, Availability Zones & Host Aggregates' write-up (fir3net.com) for a plain-English comparison (verify URL; cross-check against official docs)

**🔧 Hands-on:**
- openstack region list on each cloud
- openstack endpoint list -c Region -c 'Service Name' -c URL — see whether ONE catalog spans multiple regions
- Decide: does a single token/catalog reach both Kagoya systems? (Almost certainly NO)

**✅ Self-check:**
- In a real multi-region cloud, how many Keystones authenticate me, and how do I target region B from a single login?
- Concretely: would 'openstack --os-region-name B flavor create ...' reach the SECOND Kagoya system? Why or why not?

### 4.2 AZ = a host-aggregate partition WITHIN one deployment  _(3-4 hrs)_
**Learn:** An Availability Zone is a user-visible partition of COMPUTE hosts inside ONE deployment, implemented via a host aggregate carrying the availability_zone metadata key. A compute host belongs to exactly one nova AZ. AZs let you (and customers) place VMs on a chosen fault domain. They are scheduling/placement boundaries — NOT separate clouds, NOT separate Keystones. (Cinder has its own, separate AZ concept for volumes.)

**📚 Materials:**
- Nova 'Availability Zones': docs.openstack.org/nova/latest/admin/availability-zones.html
- Nova 'Host aggregates': docs.openstack.org/nova/latest/admin/aggregates.html
- Cinder availability-zones admin note (so you don't conflate nova and cinder AZs): docs.openstack.org/cinder/latest/admin/ (search 'availability zone')

**🔧 Hands-on:**
- openstack availability zone list ; openstack aggregate list
- Create an aggregate and set its AZ: openstack aggregate create az-test ; openstack aggregate set --zone az-test az-test ; openstack aggregate add host az-test <host>
- Boot with: openstack server create --availability-zone az-test ... and confirm placement (openstack server show -> OS-EXT-AZ:availability_zone)

**✅ Self-check:**
- What OpenStack object actually implements a nova AZ, and can one compute host be in two nova AZs at once?
- Is an AZ visible to customers? Is a host aggregate WITHOUT an AZ key visible to them?

### 4.3 Kagoya's 'two systems' = multi-CLOUD, not multi-region  _(3-4 hrs)_
**Learn:** The decisive implication for your job: if the two deployments have separate Keystones (separate catalogs, separate credentials), they are two INDEPENDENT clouds = MULTI-CLOUD. 'Create the flavor in both' therefore means: authenticate twice (two clouds.yaml entries), run the create twice, verify twice, and reconcile that they match. There is NO single command that updates both. Use clouds.yaml profiles + OS_CLOUD to keep them straight, and a diff script to catch drift.

**📚 Materials:**
- openstacksdk clouds.yaml / configuration docs: docs.openstack.org/openstacksdk/latest/user/config/configuration.html
- python-openstackclient docs on clouds.yaml and OS_CLOUD usage: docs.openstack.org/python-openstackclient/latest/configuration/
- Operations Guide multi-site considerations (concepts; dated): docs.openstack.org/operations-guide/

**🔧 Hands-on:**
- Create ~/.config/openstack/clouds.yaml with two entries kagoya-a and kagoya-b (separate auth_url/creds/region)
- Run the same command against both: OS_CLOUD=kagoya-a openstack flavor list ; OS_CLOUD=kagoya-b openstack flavor list
- Write a small script that applies an identical flavor to BOTH and then diffs 'flavor show -f json' between them, exiting non-zero on any difference (drift detector)

**✅ Self-check:**
- Why is 'two regions' the wrong mental model when each system has its own Keystone, and what concrete bug would the wrong model cause in my automation?
- What is my repeatable procedure to guarantee a new plan's flavor is IDENTICAL on both clouds, and how exactly do I detect drift?

## 5. Glance images (the OS templates)
*Why it matters:* A VPS plan is a flavor PAIRED with bootable OS images. You must know image formats and properties because (a) some image properties can OVERRIDE the matching flavor setting, and (b) for the 'disk=0' volume-backed pattern the image's virtual size matters. Image bugs surface as boot failures customers blame on you.

### 5.1 Images, disk formats (qcow2 vs raw), and the plan pairing  _(3-4 hrs)_
**Learn:** Glance stores bootable OS templates. qcow2 is compact/thin (grows on use, supports internal snapshots; good for file-backed ephemeral); raw is flat (often required or best for Ceph/LVM backends, supports zero-copy/CoW clones there, and gives the most predictable random I/O). On fast NVMe the format choice affects performance and snapshot behavior. A plan = flavor + the images it offers.

**📚 Materials:**
- Glance docs, start at the concepts/overview: docs.openstack.org/glance/latest/
- Glance 'Disk and container formats' admin reference: docs.openstack.org/glance/latest/admin/ (and the image properties page)
- qemu-img man page (man qemu-img) for inspecting/converting image formats

**🔧 Hands-on:**
- openstack image list ; openstack image show <id> -f yaml — read disk_format, size, virtual_size, min_disk, min_ram
- Download a cloud image (cirros for quick labs; an AlmaLinux/Rocky cloud image for a realistic root), run qemu-img info on it, then: openstack image create --disk-format qcow2 --container-format bare --file <img> test-img
- qemu-img convert -f qcow2 -O raw <in> <out> and compare on-disk vs virtual size to see the trade-off

**✅ Self-check:**
- When would you prefer raw over qcow2 on a Ceph or LVM backend, and why?
- Where in 'image show' do you read the minimum disk/RAM a flavor must satisfy, and how does virtual_size differ from size?

### 5.2 Image properties & metadata (and precedence over flavors)  _(3-4 hrs)_
**Learn:** Images carry properties (os_type, hw_disk_bus, hw_scsi_model, hw_qemu_guest_agent, architecture, min_disk/min_ram, hw_machine_type). For overlapping hardware settings, in many cases the IMAGE property takes precedence over the matching flavor extra_spec when both are set — a real source of 'why did my flavor setting not apply?' confusion (and you can lock this down with policy). min_disk/min_ram gate which flavors are allowed to boot an image.

**📚 Materials:**
- Compute API guide 'Flavors' / extra-specs-and-image-properties precedence: docs.openstack.org/api-guide/compute/ (search 'extra specs and image properties')
- Glance 'Useful image properties' / common metadata: docs.openstack.org/glance/latest/admin/useful-image-properties.html (verify URL)
- Nova 'Manage Flavors' for the extra_specs side: docs.openstack.org/nova/latest/admin/flavors.html

**🔧 Hands-on:**
- openstack image set --property hw_disk_bus=scsi --property hw_scsi_model=virtio-scsi <img>
- Set min_disk/min_ram on an image, then try to boot it with a too-small flavor and read the exact error
- Boot a VM, then on the host inspect the libvirt domain XML (virsh dumpxml <domain>) to confirm which setting (image vs flavor) actually won

**✅ Self-check:**
- Name one case where an image property overrides the flavor's extra_spec, and how you'd diagnose 'my flavor setting didn't apply'.
- Which two image fields determine whether a given flavor is allowed to boot that image?

## 6. Nova & the instance lifecycle
*Why it matters:* Nova is the engine that turns a flavor+image into a running QEMU/KVM guest via libvirt. When a customer's VM is stuck in BUILD/ERROR or a resize fails, you trace the lifecycle. Understanding nova-conductor's true role prevents the classic beginner misconception that it's just one sequential 'step' in a pipeline.

### 6.1 Nova components & the boot request path  _(4-5 hrs)_
**Learn:** nova-api receives the REST request; nova-scheduler (querying Placement) picks a host; nova-compute on that host drives libvirt/QEMU to create the guest (with KVM as the kernel accelerator). nova-conductor is NOT a sequential pipeline step — it's a central orchestrator and DB-proxy that mediates database access for compute nodes (so they don't touch the DB directly), handles long-running task orchestration (e.g. build/migrate), and provides version/RPC isolation. All these talk over RabbitMQ.

**📚 Materials:**
- Nova System Architecture: docs.openstack.org/nova/latest/admin/architecture.html
- Nova conductor concept: docs.openstack.org/nova/latest/ (search 'conductor') and the architecture page above
- Recorded OpenStack/OpenInfra conference talks on Nova internals (youtube.com/@openstack) — search 'Nova deep dive' (verify specific video)

**🔧 Hands-on:**
- List nova services: openstack compute service list — see api/scheduler/conductor/compute roles and their state
- Tail all nova logs while booting one VM (DevStack: journalctl -u 'devstack@n-*' -f) and watch the request touch api -> conductor -> scheduler -> compute
- Map each log line to a component, and note where conductor appears more than once

**✅ Self-check:**
- In one sentence each: what do nova-api, nova-scheduler, nova-compute, and nova-conductor do?
- Why is it wrong to picture 'api -> conductor -> scheduler' as a single straight line, and what is conductor's job for the compute nodes' DB access?

### 6.2 Instance states & transitions (build/active/error/resize/migrate)  _(4-5 hrs)_
**Learn:** Know the difference between vm_state (the stable state: ACTIVE, ERROR, SHELVED, ...) and task_state (the in-flight transition: spawning, resize_migrating, ...). Key flows: BUILD -> ACTIVE or ERROR; RESIZE (to another flavor — a COLD migration that needs a confirm/revert, leaving the VM in VERIFY_RESIZE); MIGRATE / live-migrate (move host); SHELVE; SUSPEND. Each transition is where things break; you triage by reading vm_state + task_state + the fault message. Resize is how a customer changes plan — directly relevant to your deliverable.

**📚 Materials:**
- Nova 'Virtual Machine States and Transitions': docs.openstack.org/nova/latest/reference/vm-states.html
- Nova admin resize/migrate and live-migration docs: docs.openstack.org/nova/latest/admin/ (configuring-migrations / live-migration-usage)
- Operations Guide 'Maintenance, Failures, and Debugging' (concepts; dated): docs.openstack.org/operations-guide/

**🔧 Hands-on:**
- Drive the lifecycle: server create -> server show (watch status/task_state) -> server resize --flavor bigger -> server resize confirm
- Force an ERROR (boot with an impossible flavor or when no host fits) and read the 'fault' field in 'openstack server show'
- openstack server migrate / server stop / server start — observe task_state vs vm_state during each

**✅ Self-check:**
- A VM is in ERROR — where exactly do you read the reason, and what's your first remediation step?
- What does 'resize confirm' do, why does a plan-change leave a VM in VERIFY_RESIZE, and what's the customer-visible downtime of a cold resize?

## 7. FLAVORS IN DEPTH (the deliverable)
*Why it matters:* The flavor IS the plan spec. This is the central deliverable of the phase: 'define the OpenStack flavor' for the new plan. Two well-known traps will bite you in production — editing a live flavor's extra_specs does NOTHING for already-built instances (and is discouraged), and disk=0 only behaves for volume-backed boots. Get these wrong and you mis-deliver the plan or surprise existing customers.

### 7.1 Core sizing: vCPU, RAM, root disk, ephemeral, swap  _(4-5 hrs)_
**Learn:** A flavor sets vcpus, ram (MB), disk (root GB), plus optional ephemeral (an extra non-persistent data disk) and swap (MB). These map directly to the marketed plan. Root disk vs ephemeral vs swap behave differently on delete/resize/migrate. Sizing must respect host capacity and your overcommit policy (covered in Placement).

**📚 Materials:**
- Nova 'Manage Flavors': docs.openstack.org/nova/latest/admin/flavors.html
- python-openstackclient reference for 'flavor create': docs.openstack.org/python-openstackclient/latest/
- Operations Guide user-facing operations chapter (concepts; dated): docs.openstack.org/operations-guide/

**🔧 Hands-on:**
- openstack flavor create plan-new --vcpus 2 --ram 4096 --disk 80 --ephemeral 0 --swap 0 --public
- Boot it, then in the guest verify the numbers match: nproc, free -m, lsblk
- Create a variant with --ephemeral 20, see the extra disk appear, then delete the instance and confirm ephemeral data does NOT survive

**✅ Self-check:**
- Map the new plan's marketing spec to exact flavor fields. Which field is the persistent root (for ephemeral-root flavors), which is throwaway?
- What happens to ephemeral vs root data when the instance is deleted, and what happens to ephemeral on a migration?

### 7.2 extra_specs and Trap A (live edits don't touch built instances)  _(5-6 hrs)_
**Learn:** extra_specs are key/value metadata on a flavor (e.g. hw:cpu_policy, hw:numa_nodes, quota:disk_read_iops_sec, aggregate_instance_extra_specs:<key>, trait:/resources: requests) that influence scheduling and the guest. TRAP A (confirmed in the Nova docs): Nova supports updating extra_specs but does NOT update the embedded flavor copy stored in EXISTING instances, because the change could invalidate their placement or the virt-driver context — so admins should AVOID editing extra_specs on flavors with live instances. To change behavior for existing VMs you must resize (a cold migration, not transparent). Therefore: ship a new plan as a NEW flavor, don't mutate a live one.

**📚 Materials:**
- Nova 'Manage Flavors' — the explicit warning that extra_specs changes do NOT propagate to existing instances and that resize (cold migration) is the only way to apply them: docs.openstack.org/nova/latest/admin/flavors.html
- Nova 'Extra Specs' valid-keys reference: docs.openstack.org/nova/latest/configuration/extra-specs.html (verify URL) / the flavors admin page
- Compute API guide extra-specs-and-image-properties: docs.openstack.org/api-guide/compute/

**🔧 Hands-on:**
- openstack flavor set plan-new --property hw:cpu_policy=dedicated ; boot VM-1 ; then change the property and boot VM-2 — diff 'virsh dumpxml' between the two and SEE VM-1 unchanged
- openstack flavor show plan-new -f json — read the current properties
- Practice the safe pattern: create plan-new-v2 instead of mutating plan-new, and (optionally) make plan-new private to stop new sales of the old SKU

**✅ Self-check:**
- If you 'fix' an extra_spec on a flavor that 500 customer VMs already use, what actually changes for those 500 VMs?
- Why is the correct way to ship a changed plan usually a NEW flavor (plus a resize path), and what does a resize cost the customer?

### 7.3 Trap B: disk=0 means 'use image/volume size' and is only safe volume-backed  _(4-5 hrs)_
**Learn:** Setting flavor disk=0 means Nova imposes NO root-disk size limit — for an ordinary image boot the ephemeral root then takes the image's virtual size, which can let a large image balloon onto the hypervisor unpredictably; the INTENDED use is boot-from-volume, where the Cinder root volume's size is set at boot time. So disk=0 is correct ONLY for boot-from-volume plans, which ties your flavor work directly to Cinder. This is THE bridge between the flavor and storage halves of the deliverable.

**📚 Materials:**
- Nova 'Manage Flavors' note on disk=0 behavior: docs.openstack.org/nova/latest/admin/flavors.html
- Nova 'Block Device Mapping in Nova' (boot-from-volume): docs.openstack.org/nova/latest/user/block-device-mapping.html
- Nova 'Launch an instance from a volume' user guide: docs.openstack.org/nova/latest/user/launch-instance-from-volume.html (verify URL)

**🔧 Hands-on:**
- Create flavor plan-vol --disk 0 ... ; boot it from a small image WITHOUT a volume and observe the root size = the image's virtual size
- Then boot-from-volume: openstack server create --flavor plan-vol --boot-from-volume <size> --image <img> ... and confirm Cinder provides the root (openstack server show -> os-extended-volumes / volumes_attached)
- Compare lsblk and the root device inside both guests

**✅ Self-check:**
- When is disk=0 safe, and when is it a footgun? What backs the root disk in each case?
- For a Kagoya plan that should give customers a resizable, snapshot-able root, do you want disk=0 + boot-from-volume or a fixed ephemeral disk? Justify.

## 8. Placement & scheduling (where the VM lands)
*Why it matters:* Capacity verification — 'verify KVM capacity' in your goal — IS Placement. Before you announce a plan you must know whether hosts can actually fit it, and when a boot fails with 'No valid host found' you need a repeatable toolkit. Allocation ratios (overcommit) decide how many of the new plan you can really sell per host.

### 8.1 Resource providers, inventory, allocations  _(4-5 hrs)_
**Learn:** The Placement service models each compute host as a resource provider with an INVENTORY of resource classes (VCPU, MEMORY_MB, DISK_GB, plus custom resources and traits). Booting a VM creates an ALLOCATION against a provider. Usable capacity for a class = (total * allocation_ratio) - reserved - used. This is the authoritative source of 'can the new plan fit?'.

**📚 Materials:**
- Placement docs, start at the overview: docs.openstack.org/placement/latest/
- Placement API and 'usage' concepts: docs.openstack.org/placement/latest/user/ and the api-ref
- Nova scheduling overview: docs.openstack.org/nova/latest/admin/scheduling.html

**🔧 Hands-on:**
- openstack resource provider list ; openstack resource provider inventory list <uuid> ; openstack resource provider usage show <uuid>
- Boot a VM, then re-check usage — watch VCPU/MEMORY_MB/DISK_GB allocations increase by the flavor's amounts
- Compute free capacity by hand: (total*ratio - reserved) - used, then verify how many new-plan flavors fit before reality says no

**✅ Self-check:**
- For a given host, how do you compute how many of the new plan it can hold, accounting for reserved and the allocation ratio?
- What does an 'allocation' represent, and against which resource classes does a basic flavor allocate?

### 8.2 Allocation ratios (overcommit) and capacity planning  _(4-5 hrs)_
**Learn:** cpu_allocation_ratio, ram_allocation_ratio, and disk_allocation_ratio let you advertise MORE virtual resources than physical (overcommit). They directly set how densely you pack the new plan and therefore its real cost/risk. Over-committing RAM is the most dangerous (OOM-kills hurt running guests); CPU overcommit mostly costs latency under load. On Kagoya's shared VPS hosts these ratios are a deliberate business + reliability lever. Note: these can be set per-provider in Placement inventory and/or via nova.conf defaults — know which governs in your deployment.

**📚 Materials:**
- Nova config reference for cpu_/ram_/disk_allocation_ratio and *_reserved: docs.openstack.org/nova/latest/configuration/config.html
- Nova 'Initial allocation ratios' / overcommit admin notes within scheduling docs: docs.openstack.org/nova/latest/admin/scheduling.html
- Placement docs on per-provider allocation_ratio in inventory: docs.openstack.org/placement/latest/

**🔧 Hands-on:**
- Inspect ratios: openstack resource provider inventory list <uuid> (read allocation_ratio per class)
- On DevStack, lower cpu_allocation_ratio, restart, and watch boots fail sooner with 'No valid host'; raise it and watch density increase
- Model: at ratio R, how many plan-new VMs fit one host? Validate by booting until it fails

**✅ Self-check:**
- Which allocation ratio is most dangerous to raise, and what's the customer-visible failure when you overdo it?
- How does the chosen RAM ratio change how many of the new plan you can sell per host, and where (Placement vs nova.conf) is that ratio actually set in your cloud?

### 8.3 Scheduler filters/weighers + a 'No valid host found' toolkit  _(5-6 hrs)_
**Learn:** The scheduler asks Placement for candidate providers, then applies FILTERS (ComputeFilter, AggregateInstanceExtraSpecsFilter, NUMATopologyFilter, AvailabilityZoneFilter, ...) and WEIGHERS to rank survivors. 'No valid host found' has a small, finite set of causes: not enough inventory, allocation ratio/reserved too tight, a filter excluding hosts (aggregate/extra_spec mismatch, AZ, NUMA), or a compute not reporting to Placement (service down/disabled). Build a fixed diagnostic checklist.

**📚 Materials:**
- Nova 'Compute schedulers' (filters/weighers): docs.openstack.org/nova/latest/admin/scheduling.html
- Nova troubleshooting + scheduler debug logging guidance: docs.openstack.org/nova/latest/admin/
- A 'No valid host found' worked example — search OpenStack Launchpad bugs / ask.openstack.org for the resize candidates-empty case (verify the specific report before citing)

**🔧 Hands-on:**
- Reproduce 'No valid host found' three ways: an oversized flavor, an extra_spec with no matching aggregate, and a disabled/stopped nova-compute
- For each, run the toolkit: openstack hypervisor list ; openstack compute service list (is compute up/enabled?) ; resource provider usage show ; enable scheduler debug logging and read WHY each host was rejected
- Write the checklist as a one-page runbook you keep next to your desk

**✅ Self-check:**
- List the 4-5 root causes of 'No valid host found' and the single command that confirms each.
- A brand-new plan flavor won't schedule but old flavors do — what do you check first, and why does that point at a filter/extra_spec?

## 9. Neutron in OpenStack context (just enough)
*Why it matters:* You don't own networking deeply, but every VM needs a port, and plan/boot failures often involve networking. You must distinguish provider networks (the VLAN/flat networks Kagoya likely uses to give customers reachable IPs) from floating IPs (NAT on self-service overlays), because it changes how a customer's VM gets a public address — and how tenants are isolated.

### 9.1 Provider networks vs self-service networks + floating IPs  _(3-4 hrs)_
**Learn:** A provider network maps directly onto a physical L2 segment (VLAN or flat) and typically hands out directly-routable addresses — common in VPS, where each VM gets a public/public-ish IP on its port. Self-service (tenant) networks are virtual overlays (VXLAN/GENEVE) that reach the outside via a Neutron router doing SNAT, with public reachability provided by a FLOATING IP (1:1 NAT) associated to the port. Floating IPs only exist in the router/overlay model — on a pure provider network there is no floating IP, the port's fixed IP is already routable. Know which model each Kagoya cloud uses; it dictates how a new plan's VM becomes reachable and how tenants are isolated.

**📚 Materials:**
- Neutron admin networking intro: docs.openstack.org/neutron/latest/admin/intro-os-networking.html
- Neutron 'Provider networks' and 'Self-service networks' deploy scenarios: docs.openstack.org/neutron/latest/admin/ (deploy-* pages)
- Neutron OVN tutorial (modern default backend): docs.openstack.org/neutron/latest/admin/ovn/ (verify exact tutorial page)

**🔧 Hands-on:**
- openstack network list ; openstack network show <net> -f yaml — read provider:network_type / provider:physical_network / provider:segmentation_id
- Boot a VM on a provider net (note it gets a routable fixed IP, no floating IP needed) and on a self-service net (create a router, allocate + associate a floating IP)
- openstack port list --server <id> ; trace the port to its network type

**✅ Self-check:**
- How does a VM get a public IP under provider networking vs under the floating-IP/NAT model?
- Which model does each Kagoya cloud use, and why does a pure provider network not need a floating IP?

## 10. Cinder block storage (the other half of the plan)
*Why it matters:* For modern VPS plans the root disk is a Cinder VOLUME (boot-from-volume), and your deliverable explicitly includes 'define a Cinder volume type'. Volume types route to backends, can carry QoS, and enable snapshots/resize — features customers pay for. This is where disk=0 from the flavor topic pays off.

### 10.1 Volumes, attach, and the lifecycle  _(4-5 hrs)_
**Learn:** A Cinder volume is persistent block storage provisioned from a backend, attachable to an instance (multiattach is a special opt-in case), online-resizable, snapshot-able, and surviving instance delete UNLESS delete_on_termination is set for that block device. Understand create/attach/detach/extend/delete and the states: creating -> available -> reserved/attaching -> in-use, plus error states.

**📚 Materials:**
- Cinder docs, start with the volume admin/user sections: docs.openstack.org/cinder/latest/
- python-openstackclient reference for 'volume': docs.openstack.org/python-openstackclient/latest/
- Cinder 'Manage volumes' admin page: docs.openstack.org/cinder/latest/admin/ (volume operations)

**🔧 Hands-on:**
- openstack volume create --size 10 v1 ; openstack server add volume <srv> v1 ; in the guest: lsblk, mkfs.ext4, mount
- openstack volume set --size 20 v1 (extend) then grow the filesystem in-guest (resize2fs/xfs_growfs)
- Detach, delete, and observe the states via openstack volume show ; then boot a VM with a volume marked delete_on_termination and confirm it disappears on instance delete

**✅ Self-check:**
- What survives an instance delete: an attached data volume, or an ephemeral disk? Under what exact setting does the attached volume ALSO get deleted?
- Walk the states a volume passes through from create to in-use.

### 10.2 Volume types -> backends (the deliverable)  _(4-5 hrs)_
**Learn:** A volume TYPE is the customer-facing storage SKU; its extra_specs (notably volume_backend_name) route volumes to a specific backend (LVM, Ceph/RBD, a vendor driver), and a QoS spec can be associated to it. Defining the new plan's volume type — name + backend mapping + QoS — is a core Phase 5 deliverable, and must be created IDENTICALLY on both clouds. Note that adding a NEW backend is an install-method config+redeploy operation (from the Pre-step); creating a volume TYPE that points at an existing backend is a safe runtime API operation.

**📚 Materials:**
- Cinder 'Manage volume types' and multi-backend admin docs: docs.openstack.org/cinder/latest/admin/ (volume-types / multi-backend pages)
- Cinder config reference for backends and volume_backend_name: docs.openstack.org/cinder/latest/configuration/
- python-openstackclient reference for 'volume type': docs.openstack.org/python-openstackclient/latest/

**🔧 Hands-on:**
- openstack volume type create plan-nvme ; openstack volume type set --property volume_backend_name=<backend> plan-nvme
- openstack volume create --type plan-nvme --size 10 t1 ; confirm it landed on the right backend: openstack volume show t1 (os-vol-host-attr:host)
- Repeat on the second cloud via OS_CLOUD and diff the two type definitions ('volume type show -f json')

**✅ Self-check:**
- Which single extra_spec routes a volume type to a particular backend?
- What is your procedure to guarantee the new plan's volume type is identical on both Kagoya clouds, and how do you detect drift? Which of (adding a backend) vs (creating a type) is a safe runtime op?

### 10.3 Snapshots & boot-from-volume vs ephemeral (closes the disk=0 loop)  _(4-5 hrs)_
**Learn:** A Cinder snapshot is a point-in-time copy of a volume (often CoW on the backend). Boot-from-volume means the instance's ROOT is a Cinder volume (pairs with flavor disk=0), giving persistence across rebuild, online resize, snapshots, and easier live-migration — versus an ephemeral root that dies with the instance. Choosing boot-from-volume for the plan is a deliberate product decision with a cost (every VM consumes backend capacity and Cinder quota).

**📚 Materials:**
- Cinder snapshot admin docs: docs.openstack.org/cinder/latest/admin/ (volume snapshots) and the user guide
- Nova boot-from-volume / block device mapping: docs.openstack.org/nova/latest/user/block-device-mapping.html
- Nova 'Launch an instance from a volume': docs.openstack.org/nova/latest/user/launch-instance-from-volume.html (verify URL)

**🔧 Hands-on:**
- Boot-from-volume: openstack server create --flavor plan-vol(disk=0) --boot-from-volume <size> --image <img> ... OR create a bootable volume from an image then boot it
- openstack volume snapshot create ; create a NEW volume from that snapshot ; boot it — prove recoverability
- Compare against an ephemeral-root VM: delete both, see what remains (the boot volume vs nothing)

**✅ Self-check:**
- Why does the new plan's disk=0 flavor REQUIRE boot-from-volume to behave well?
- Which gives the customer a snapshot-able, resizable root: ephemeral or boot-from-volume? What does choosing it cost in backend capacity and Cinder quota?

## 11. Storage fundamentals (the physics under Cinder)
*Why it matters:* You're shipping a plan on fast NVMe hardware (Kagoya's platform). To set HONEST QoS caps, size capacity, and avoid the thin-pool-full outage, you must understand the underlying storage physics independent of OpenStack — otherwise you'll mis-sell performance and risk real outages.

### 11.1 Block vs file vs object; the performance vocabulary  _(4-5 hrs)_
**Learn:** Block (Cinder/iSCSI/NVMe — raw disks, lowest latency), file (NFS/CephFS — shared filesystem), object (Swift/S3 — HTTP blobs). For performance, learn the dials and how they trade: IOPS vs THROUGHPUT (MB/s) vs LATENCY (ms/us), plus BLOCK SIZE and QUEUE DEPTH. Rule of thumb: small-block random I/O is IOPS-bound; large-block sequential I/O is throughput-bound; and throughput = IOPS x block_size. These define what a QoS cap actually limits.

**📚 Materials:**
- fio documentation and man page: fio.readthedocs.io and 'man fio' — the canonical benchmarking tool
- Brendan Gregg, 'Systems Performance' (2nd ed.) — the disk I/O chapter (optional paid gem; free talks and the USE method on brendangregg.com)
- Cinder/Red Hat background on block vs file vs object storage (docs.openstack.org/cinder/latest/ overview; Red Hat storage concept articles)

**🔧 Hands-on:**
- Install fio; run a 4k random-read IOPS test (--bs=4k --rw=randread --iodepth=32) vs a 1M sequential-read throughput test (--bs=1M --rw=read --iodepth=1) on a test volume — watch IOPS vs MB/s diverge
- Vary --iodepth 1 vs 32 and watch IOPS and latency change together
- Record a small results table to anchor your intuition, and verify throughput ≈ IOPS x block_size

**✅ Self-check:**
- For a 4k random workload, which metric (IOPS or MB/s) is the binding constraint, and why?
- Define queue depth in one sentence and explain why increasing it raises measured IOPS up to a point.

### 11.2 RAID 0/1/5/6/10 and 'RAID is not backup'  _(4-5 hrs)_
**Learn:** RAID combines disks for performance and/or redundancy: 0 (stripe, fast, NO redundancy), 1 (mirror), 5 (single-parity), 6 (double-parity), 10 (mirror+stripe). Each trades usable capacity, write performance (parity write penalty on 5/6), fault tolerance, and rebuild risk (large drives = long, risky rebuilds — a second failure during RAID5 rebuild loses everything). CRITICAL operating truth: RAID protects against DISK failure only — NOT against accidental deletion, corruption, or ransomware. RAID is NOT a backup. This frames the snapshot-vs-backup mis-selling risk later.

**📚 Materials:**
- mdadm man page ('man mdadm') and the Linux RAID wiki (raid.wiki.kernel.org)
- Arch Wiki 'RAID' page for clear level comparisons (wiki.archlinux.org/title/RAID; verify URL)
- A reputable storage-vendor RAID-levels primer with capacity/performance comparison tables (verify URL before citing)

**🔧 Hands-on:**
- With loopback files + mdadm, build a RAID1 and a RAID5 (mdadm --create), then 'mdadm --fail' a device and watch the rebuild via /proc/mdstat
- Compute and compare usable capacity of RAID1 vs RAID5 vs RAID6 vs RAID10 for the same N disks
- Articulate why an 'rm -rf' on a mounted array is unrecoverable despite a perfectly healthy RAID

**✅ Self-check:**
- For a write-heavy VPS volume pool, why might RAID10 beat RAID5/6 despite using more raw disks?
- Give two distinct failure modes RAID does NOT protect against.

### 11.3 LVM, thin provisioning, oversubscription & the thin-pool-full outage  _(4-5 hrs)_
**Learn:** LVM virtualizes block storage (PV -> VG -> LV, plus snapshots and online resize) and underlies the Cinder LVM driver. THIN provisioning/oversubscription lets you allocate more logical space than physically exists — efficient but dangerous: if the thin POOL's data (or metadata) space fills, writes to ALL thin volumes on that pool fail / go read-only = a real multi-customer outage. You must monitor BOTH data_percent and metadata_percent and set the oversubscription ratio deliberately.

**📚 Materials:**
- LVM man pages: 'man lvm', 'man lvcreate', 'man lvs', and especially 'man lvmthin' (thin provisioning)
- Red Hat 'Configuring and managing logical volumes' guide (docs.redhat.com) — LVM and thin-pool admin
- Cinder LVM driver + max_over_subscription_ratio config reference: docs.openstack.org/cinder/latest/configuration/

**🔧 Hands-on:**
- Build a VG on a loopback PV; create a thin pool (lvcreate --type thin-pool); create thin LVs that SUM to more than the pool; write data until the pool fills and observe write failures / read-only behavior
- Watch 'lvs -o +data_percent,metadata_percent' as the pool approaches 100% (and note metadata can fill before data)
- Map this to Cinder's max_over_subscription_ratio and reserved_percentage

**✅ Self-check:**
- What exactly happens to customer volumes when a thin pool reaches 100% data (or metadata) usage?
- Which TWO metrics would you alert on to prevent a thin-pool-full outage, and at what threshold?

### 11.4 NVMe vs SATA/AHCI: the '~10x' is mostly sequential, not single-thread random  _(3-4 hrs)_
**Learn:** NVMe drives marketed as ~10x SATA — understand WHY so you don't over-promise. Two distinct advantages: (1) raw bus bandwidth (PCIe 4.0 x4 is roughly an order of magnitude over SATA III's 6 Gb/s ~600 MB/s), which shows up as PEAK SEQUENTIAL throughput; and (2) the NVMe command model exposes many parallel queues with deep depth, vs AHCI/SATA's single command queue (NCQ depth ~32), which shows up as much higher RANDOM IOPS UNDER CONCURRENCY. So a high-concurrency or large-sequential workload realizes the multiple; a single-threaded, shallow-queue-depth workload will NOT see ~10x. This stops you from advertising IOPS a real customer workload can't hit.

**📚 Materials:**
- NVM Express overview / spec materials on multiple queues and queue depth (nvmexpress.org; verify the specific page) and vendor whitepapers on NVMe vs AHCI queueing
- fio docs to prove it empirically: fio.readthedocs.io
- Kagoya's own platform/spec pages (kagoya.jp/vps and the platform-renewal announcement) — ground truth for exactly what is marketed; confirm the drive class and PCIe generation yourself

**🔧 Hands-on:**
- On an NVMe-backed volume run fio at --iodepth=1 --numjobs=1 (shallow) vs --iodepth=64 --numjobs=4 (deep/parallel) and watch the multiple appear ONLY at high concurrency
- Run a 1M sequential test (throughput) vs a 4k random low-QD test (IOPS) and observe where the '~10x' shows and where it does not
- Note the HONEST IOPS your QoS cap should advertise based on a realistic workload

**✅ Self-check:**
- Where do NVMe's two advantages come from, and which customer workload pattern realizes the headline multiple?
- Why might a customer's single-threaded app NOT see the marketed speedup, and how should that inform the plan's advertised QoS numbers?

## 12. Cinder QoS (capping a plan's IOPS)
*Why it matters:* To differentiate plans and protect shared NVMe hosts from a 'noisy neighbor', you cap each plan's I/O via a Cinder QoS spec attached to its volume type. This converts your storage-physics knowledge into an enforceable, sellable plan attribute — and prevents one customer from starving others on the same backend.

### 12.1 QoS specs on volume types: iops and bytes caps + consumer  _(4-5 hrs)_
**Learn:** A Cinder QoS spec is created separately, then ASSOCIATED with a volume type. It can cap IOPS via total_iops_sec OR the pair read_iops_sec/write_iops_sec, and bandwidth via total_bytes_sec OR read_bytes_sec/write_bytes_sec — and (confirmed in the Cinder docs) you CANNOT use a total_* value together with the matching read_/write_* values for the same dimension. There are also *_max (burst) variants. The consumer field = front-end (the hypervisor/libvirt enforces it — typical for QEMU/KVM), back-end (the storage driver enforces), or both. This is how the new plan's IOPS ceiling is actually enforced.

**📚 Materials:**
- Cinder 'Basic volume quality of service': docs.openstack.org/cinder/latest/admin/basic-volume-qos.html (states total_* cannot combine with read_/write_*)
- Cinder 'Capacity based quality of service' (per-GB scaling of caps): docs.openstack.org/cinder/latest/admin/capacity-based-qos.html
- libvirt <iotune> / blkdeviotune reference (libvirt.org) to understand front-end enforcement on QEMU/KVM

**🔧 Hands-on:**
- openstack volume qos create plan-qos --consumer front-end --property read_iops_sec=20000 --property write_iops_sec=10000 --property total_bytes_sec=200000000
- openstack volume qos associate plan-qos <plan-volume-type-id>
- Boot a VM with a volume of that type and PROVE the cap with fio (IOPS should plateau at the limit); on the host inspect 'virsh dumpxml' for the <iotune> block to confirm front-end enforcement

**✅ Self-check:**
- Which QoS keys cap a plan's IOPS vs its bandwidth, and what is the rule about mixing total_* with read_/write_* for the same dimension?
- With consumer=front-end on QEMU/KVM, WHERE is the cap enforced, and how do you verify it from inside the guest (and from the host)?

## 13. Snapshots vs backups vs replication & 3-2-1
*Why it matters:* This is a customer-trust and mis-selling boundary, sharp in the Japanese market. If marketing or a customer believes a CoW snapshot on the SAME storage is a 'backup', a single backend failure becomes a data-loss incident and a contract problem. You must be able to state precisely what each protects against.

### 13.1 CoW snapshot != backup; backup; replication; 3-2-1  _(3-4 hrs)_
**Learn:** A snapshot (often copy-on-write) is a fast point-in-time view, usually on the SAME backend — great for quick rollback, useless if that backend/array dies (and a CoW snapshot may even share blocks with the source). A backup (cinder-backup) is an INDEPENDENT copy on different media/location (e.g. a Swift/S3 store or NFS). Replication keeps a synced second copy for HA/DR — it protects against site/array failure but is NOT history (it faithfully replicates a deletion or corruption too). The 3-2-1 rule: 3 copies, on 2 different media, with 1 offsite. Map each plan feature to what it actually protects against to avoid mis-selling.

**📚 Materials:**
- Cinder backups (cinder-backup) admin docs vs snapshot docs: docs.openstack.org/cinder/latest/admin/ (volume-backups and volume snapshots pages)
- Cinder volume replication admin docs: docs.openstack.org/cinder/latest/admin/ (volume replication)
- 3-2-1 backup rule primer from a reputable source (e.g. CISA/US-CERT guidance or a major backup vendor explainer; verify URL)

**🔧 Hands-on:**
- Create a volume SNAPSHOT and a cinder BACKUP (openstack volume backup create) of the same volume; note where each is stored (same backend vs separate backup store)
- Simulate backend loss in DevStack (remove/disable the volume backend) and confirm the snapshot is gone but the backup (separate store) survives and can be restored
- Write a one-paragraph 'what protects against what' table covering snapshot / backup / replication

**✅ Self-check:**
- Give the exact one-sentence explanation you'd use with marketing for why a snapshot is NOT a backup.
- Under 3-2-1, which of snapshot/backup/replication can satisfy the 'offsite' copy, and which never can on its own?

## 14. Tenant isolation as a SECURITY boundary
*Why it matters:* A Japanese security audit (and customer trust) hinges on proving customer A can never see or touch customer B's compute, network, or DATA — including remnants on reused storage. As infra owner you must know each isolation mechanism and how to DEMONSTRATE it, because failures here are the most serious incidents.

### 14.1 Network isolation: VLAN/VXLAN, security groups, port security/anti-spoofing  _(4-5 hrs)_
**Learn:** Tenants are separated at L2 by VLAN or VXLAN/GENEVE segmentation IDs; security groups are per-port stateful firewalls that should default to DENY inbound (and allow outbound); port security / allowed-address-pairs (anti-spoofing) stops a VM from forging a MAC/IP it wasn't assigned. Together these enforce that one customer's traffic can't reach or impersonate another's. Note: with the OVN backend, security groups are implemented via OVN ACLs rather than iptables on the host — verify which backend your clouds use.

**📚 Materials:**
- Neutron security groups and port-security admin docs: docs.openstack.org/neutron/latest/admin/ (security-groups, port-security, allowed-address-pairs pages)
- OpenStack Security Guide — networking and tenant-isolation chapters: docs.openstack.org/security-guide/
- Neutron OVN admin docs (if your clouds run OVN): docs.openstack.org/neutron/latest/admin/ovn/

**🔧 Hands-on:**
- Two projects, two VMs on isolated networks: confirm they cannot ping across; inspect 'openstack security group rule list' for the default group (confirm default-deny inbound)
- Try to spoof an IP/MAC on a port WITH port security on (should fail), then add an allowed-address-pair or disable port security and see it work — observe the protection
- openstack network show -> provider:segmentation_id to confirm VLAN/VXLAN separation between the two tenants

**✅ Self-check:**
- Name the three mechanisms that stop customer A from reaching or impersonating customer B on the network.
- What is a security group's default inbound policy, and why does default-deny matter for an audit?

### 14.2 Data isolation: disk wiping on delete, per-project quota/scoping  _(4-5 hrs)_
**Learn:** When a volume or ephemeral disk is deleted and its space reused by another tenant, residual data must not leak. For the Cinder LVM driver, volume_clear (none/zero) and volume_clear_size control whether freed blocks are wiped on delete; thin-provisioned and many array/Ceph backends instead rely on the backend never returning stale blocks (TRIM/zero-on-allocate) — so you must know YOUR backend's exact behavior. Nova can wipe ephemeral disks too. Separately, per-project quotas, metadata, and Keystone scoping ensure one project's resources/limits are invisible to others. Auditors will ask exactly how deleted data is sanitized on each backend.

**📚 Materials:**
- Cinder configuration reference for volume_clear / volume_clear_size (LVM driver) and backend secure-delete behavior: docs.openstack.org/cinder/latest/configuration/
- Nova ephemeral disk handling docs and the OpenStack Security Guide 'tenant data privacy' / data-disposal chapter: docs.openstack.org/security-guide/
- Your backend vendor/Ceph docs on whether freed blocks are zeroed/TRIMmed (the authoritative source for non-LVM backends)

**🔧 Hands-on:**
- On DevStack (LVM), inspect/set volume_clear in cinder.conf; delete a volume and check whether the backing LVM extents are zeroed (read the raw device region the LV occupied)
- openstack quota show for two projects — confirm limits are isolated per project
- Confirm a customer-scoped token CANNOT list another project's volumes/servers

**✅ Self-check:**
- When a customer deletes a volume on a SHARED backend, what mechanism guarantees the next customer can't read the old bytes — and does the answer differ for LVM vs Ceph/array backends?
- Which Cinder/Nova settings (or backend behaviors) control disk sanitization, and what concrete evidence would you show an auditor?

## 15. Horizon vs openstack CLI vs raw REST (three doors)
*Why it matters:* All three hit the SAME Keystone-fronted REST APIs; your Infra API is the REST door. You must move fluently between them: Horizon to eyeball state, CLI to act fast, REST to understand and replicate exactly what your code must send. And you must distinguish a quota-exceeded refusal (policy) from a real capacity-exceeded condition (physics) — they look similar to a customer but have OPPOSITE fixes.

### 15.1 Three interfaces, one API; projects, quotas, and the quota-vs-capacity distinction  _(4-5 hrs)_
**Learn:** Horizon (web) and the openstack CLI are just clients of the same REST APIs your Infra API calls — anything they do, REST can do (Horizon can do slightly less than the full API, never more). Quotas are per-project policy limits (instances, vCPUs, RAM, volumes, volume GB, ...) enforced AT the API. KEY distinction: 'quota exceeded' = you hit a CONFIGURED limit (fix: raise the quota — no hardware needed); 'No valid host found'/capacity exceeded = real physical resources are gone (fix: free or add hardware, or change allocation ratios). Confusing the two sends you fixing the wrong thing under pressure.

**📚 Materials:**
- python-openstackclient docs (CLI) and the 'quota' command reference: docs.openstack.org/python-openstackclient/latest/
- Nova quotas and Cinder quotas admin docs: docs.openstack.org/nova/latest/admin/quotas.html and docs.openstack.org/cinder/latest/admin/ (quotas)
- The REST API references at docs.openstack.org/api-ref/ (compute, identity, block-storage) and Horizon docs: docs.openstack.org/horizon/latest/

**🔧 Hands-on:**
- Do ONE action three ways: create a server in Horizon, via 'openstack server create', and via a raw curl POST to /servers with a token — diff the request bodies
- openstack quota set --instances 1 <project> ; try to boot a 2nd instance -> read the 'quota exceeded' (403) error; raise quota and retry
- Then trigger a real 'No valid host found' (capacity) and contrast the two error messages side by side

**✅ Self-check:**
- A customer can't launch a VM: how do you tell quota-exceeded from capacity-exceeded from the error alone, and what's the correct fix for each?
- Why does it follow that anything Horizon shows, your Infra API can replicate via REST?

## 16. End-to-end trace (tie it all together)
*Why it matters:* This is the capstone skill: when ANYTHING about a VM or the new plan misbehaves, you can follow one request across Keystone -> Nova -> Placement -> Neutron -> Cinder -> libvirt/QEMU/KVM, with the exact CLI and log at each hop. It proves you truly own the infra seam and can debug across the whole stack your Infra API drives.

### 16.1 Boot-from-volume trace with a CLI + log per hop  _(5-6 hrs)_
**Learn:** Follow a single boot-from-volume server-create end to end and name, at each hop, the responsible service, the verifying CLI, and the log to read: Keystone (token issued / auth), nova-api (request accepted), nova-conductor (orchestration/DB), Placement (allocation candidates), nova-scheduler (host selected), Cinder (root volume created + attached), Neutron (port created/bound), nova-compute -> libvirt -> QEMU/KVM (domain defined and started). This is your master mental model and runbook.

**📚 Materials:**
- Nova architecture + troubleshooting: docs.openstack.org/nova/latest/admin/architecture.html and the admin troubleshooting pages
- Operations Guide 'Maintenance, Failures, and Debugging' (concepts; dated): docs.openstack.org/operations-guide/
- Per-service log locations per YOUR install method (from the Pre-step): Kolla (/var/log/kolla/<service>/), OSA, or distro paths; 'man journalctl' for systemd-based DevStack; 'man virsh' for the hypervisor hop

**🔧 Hands-on:**
- On DevStack, tail ALL service logs at once, then run: openstack server create --flavor plan-vol(disk=0) --boot-from-volume <size> --image <img> ... and annotate each log line to a hop
- Verify each hop live: openstack token issue ; openstack server show ; openstack resource provider usage show ; openstack volume show ; openstack port list --server <id> ; then on the host 'virsh list' and 'virsh dumpxml <domain>'
- Produce a one-page 'trace map': hop -> service -> verifying command -> log file

**✅ Self-check:**
- For a boot-from-volume create, list every service touched in order and the ONE command that confirms each is healthy.
- Given 'instance stuck in BUILD', walk your trace and state which hop you'd inspect FIRST and the exact log you'd open (hint: think RabbitMQ / scheduler / Placement).

## 🎯 Phase capstone
END-TO-END SHIP OF THE NEW PLAN ON A DEVSTACK 'TWO-CLOUD' RIG, audit-ready. In one project, deliver: (1) Stand up DevStack (or two DevStacks / two clouds.yaml profiles to simulate Kagoya's multi-cloud) and record the release + install-method map from the Pre-step. (2) Define the new plan as a NEW boot-from-volume flavor (disk=0, sized vCPU/RAM, correct extra_specs) plus a NEW Cinder volume type routed to a backend, with a Cinder QoS spec capping IOPS/bandwidth — created IDENTICALLY on BOTH clouds via OS_CLOUD, with a script that diffs the two definitions ('-f json') and EXITS NON-ZERO on any drift. (3) Verify host/KVM capacity in Placement: compute, from (inventory*allocation_ratio - reserved) minus usage, how many of the new plan fit per host, then confirm empirically by booting until 'No valid host found' and explaining the cause from your toolkit. (4) Boot a customer VM on the new plan, PROVE the QoS cap with fio (IOPS plateaus at the limit; confirm <iotune> in virsh dumpxml), PROVE tenant isolation (a second project can't see/reach/spoof it, and demonstrate your backend's deleted-data sanitization behavior), and demonstrate a plan-change via resize (and the VERIFY_RESIZE confirm step). (5) Trace one boot-from-volume create end-to-end (Keystone -> nova-api/conductor -> Placement -> scheduler -> Cinder -> Neutron -> libvirt/QEMU/KVM) with a CLI + log cited per hop. Deliverable artifacts: the clouds.yaml, the idempotent flavor/volume-type/QoS create scripts (run on both clouds), the drift-diff script, the capacity calculation, the fio QoS proof, the isolation evidence, and the one-page end-to-end trace runbook. Acceptance: a second person can run your scripts on both clouds and get identical, drift-free plan definitions, and you can correctly answer 'is a customer's snapshot a backup?', 'quota-exceeded vs capacity-exceeded?', and 'where is the QoS cap actually enforced?'.

## 🧰 Primary resources for this phase
- OpenStack official documentation, read at the per-release path matching the Pre-step (docs.openstack.org/<service>/<release>/, NOT /latest/): Keystone (keystone/.../admin/), Nova flavors and scheduling (nova/.../admin/flavors.html and /scheduling.html), Placement (placement/.../), Cinder QoS (cinder/.../admin/basic-volume-qos.html), Neutron, and Glance. This is the canonical source for every service.
- DevStack — the official throwaway test cloud you break and rebuild: 'All-In-One Single Machine' guide at docs.openstack.org/devstack/latest/guides/single-machine.html (and the DevStack root docs.openstack.org/devstack/latest/). Your lab for the whole phase.
- OpenStack Operations Guide — operator mindset, architecture, capacity planning, and 'Maintenance, Failures, and Debugging': docs.openstack.org/operations-guide/ (also an O'Reilly book). IMPORTANT: this is the classic community guide last substantively updated ~2017 — superb for concepts, but verify any version-specific command against the current per-service docs.
- OpenStack Security Guide: docs.openstack.org/security-guide/ — tenant isolation, networking, and data-privacy/disposal chapters; your reference for what a Japanese security audit will probe.
- Storage fundamentals canonical references: fio docs and man page (fio.readthedocs.io, 'man fio') for benchmarking and QoS proof; Linux man pages 'man lvm', 'man lvmthin', 'man mdadm' for LVM/thin-provisioning/RAID; and Brendan Gregg's 'Systems Performance' (2nd ed.) disk-I/O chapter as an optional depth gem (free talks on brendangregg.com).
- Kagoya's own platform and plan pages (kagoya.jp/vps and the OpenStack/KVM NVMe platform-renewal announcement) — ground truth for exactly what hypervisor, storage class, PCIe generation, and marketed performance your new plan must honestly map onto; confirm these specifics yourself rather than trusting marketing copy. For video walkthroughs, prefer the official OpenStack/OpenInfra YouTube channel (youtube.com/@openstack) and verify any specific tutorial playlist before relying on it.

---

# Phase 6 — Operations, Reliability, Delivery & Migration
**Duration:** 10–12 weeks part-time (~10–12 hrs/week)

> You now OWN the infrastructure seam (Infra API -> two OpenStack clouds -> KVM -> customer VMs). Phases 1-5 taught you how the machine works; Phase 6 teaches you how to keep it ALIVE in production and how to change it without breaking customers - because the two things you'll actually be paid for are (a) shipping the new VPS plan safely into BOTH deployments and (b) getting off CentOS 7 before its EOL bites you via an unpatched qemu-kvm/kernel. Treat every topic through one lens: "a real customer's VM is running on a host I'm responsible for, and a contract (SLA) and a billing system depend on it." Build a tiny 2-host KVM/libvirt lab early (nested virtualization on one machine is fine for everything except raw performance numbers - say so when you report results) and DO the hands-on: reliability is a muscle, not a fact you memorize. Move foundational->advanced: mindset and observability first, then alerting/SLOs, then incident response and change management (the two disciplines that prevent and contain most outages), then the hard hands-on (live migration), then security/backup/capacity/multi-tenant/IP, then the business and Japanese-SI delivery context, finishing with an end-to-end synthesis that wires the new plan from spec to 検収 (acceptance) to capacity monitoring. One honesty rule throughout: when a lab result depends on nested virt or a single machine (e.g. live-migration timing, NVMe throughput), label it as indicative, not production-grade.

## 1. Day-2 Operations Mindset
*Why it matters:* Once the new plan ships and the migration starts, you live in Day-2: not building, but RUNNING customer VMs on hosts that WILL fail. Your job stops being 'make it work' and becomes 'make failures rare, small, fast to detect, fast to recover' - the lens for everything else in this phase.

### 1.1 Day-1 vs Day-2, and the four reliability levers (rare / small / fast-detect / fast-recover)  _(3-4 hrs)_
**Learn:** Day-0 design, Day-1 deploy, Day-2 operate/maintain. You cannot make failure rate zero, so you optimize four independent levers: reduce frequency (rare), reduce blast radius (small), reduce time-to-detect (MTTD), reduce time-to-recover (MTTR). Availability ~= MTBF/(MTBF+MTTR); cutting MTTR is often cheaper than chasing MTBF.

**📚 Materials:**
- Google 'Site Reliability Engineering' (free, sre.google/sre-book), Ch.1 'Introduction' and Ch.3 'Embracing Risk'
- The SRE Workbook, Ch.1 'How SRE Relates to DevOps' (sre.google/workbook)
- Charity Majors - 'Operability' / 'Test in Production' writing on honeycomb.io/blog (search by title; verify URL)

**🔧 Hands-on:**
- Write a one-page failure inventory for your lab: list 10 ways a customer VM can go down (host PSU, disk, kernel panic, OOM-killer, network, full Cinder backend, bad config push) and tag each with which of the 4 levers most helps
- On a lab VM, simulate memory pressure (stress-ng --vm 1 --vm-bytes 90% --timeout 60s) and time how long until you NOTICE with current tooling - that's your MTTD baseline

**✅ Self-check:**
- For a host with one failing disk, which lever matters most and why?
- If MTBF is 1 year and MTTR is 4 hours vs 20 minutes, what does each give for annual availability (show the arithmetic)?

### 1.2 Toil, runbooks-as-product, and 'operability' as a design property  _(2-3 hrs)_
**Learn:** Toil = manual, repetitive, automatable, tactical, no-enduring-value work that scales linearly with load; it's the enemy of Day-2. Good ops means designing the system (and the new plan) so it is observable, recoverable and changeable - operability is decided at design time, not bolted on.

**📚 Materials:**
- SRE book Ch.5 'Eliminating Toil' (sre.google/sre-book/eliminating-toil)
- The SRE Workbook, 'Eliminating Toil' chapter (sre.google/workbook/eliminating-toil)
- Google 'Class SRE implements DevOps' YouTube playlist (Google Cloud Tech channel)

**🔧 Hands-on:**
- List your current/likely toil for the new plan (e.g. manually SSHing to each compute node to check free RAM) and mark each as automatable yes/no
- Convert one manual check into a 5-line bash or ansible ad-hoc task so it's repeatable across all hosts at once

**✅ Self-check:**
- Is 'SSHing to each compute node to check free RAM' toil? Which of the 5 toil properties does it hit?
- Name one design choice in the new flavor (e.g. shared-storage-only so live-migration always works) that makes Day-2 ops easier.

## 2. Observability (metrics, logs, traces, events)
*Why it matters:* You cannot keep customer VMs alive on KVM hosts you can't see into. You must read OpenStack service state, libvirt/qemu, and Linux host signals (journald) to detect a sick host BEFORE customers feel it - the input to every alert, SLO and incident in this phase.

### 2.1 The four telemetry types: metrics vs logs vs traces vs events (and when each)  _(4-5 hrs)_
**Learn:** Metrics = cheap numeric time-series, great for trends/alerting (CPU, free RAM, qemu process count). Logs = high-cardinality discrete records, great for 'why'. Traces = a request's path across services, great for latency attribution across the Infra API -> nova-api -> nova-conductor -> nova-compute -> libvirt chain. Events = notable state changes (VM created, host down). Know each one's strengths and storage cost so you instrument the right thing.

**📚 Materials:**
- Brendan Gregg 'Systems Performance' 2nd ed., Ch.1-2 (methodologies, observability tools) + brendangregg.com 'The USE Method'
- Prometheus docs 'Concepts -> Metric types' (prometheus.io/docs/concepts/metric_types)
- OpenTelemetry docs 'Observability primer' (opentelemetry.io/docs/concepts/observability-primer)

**🔧 Hands-on:**
- On your KVM host run node_exporter and scrape it with a local Prometheus; graph MemAvailable and the run-queue (node_load1 vs CPU count) in Grafana
- For one VM-create, find the SAME event in three places: the nova service log, the libvirtd log, and journald - note what each tells you that the others don't

**✅ Self-check:**
- You want to alert 'a compute host's free RAM is trending toward overcommit pain' - metric, log, trace or event?
- Why are logs a bad PRIMARY alerting source for high-frequency host signals (cost/cardinality/latency)?

### 2.2 OpenStack & libvirt observability in practice (Nova/Cinder/Keystone logs, nova-conductor role, libvirt, virsh)  _(5-6 hrs)_
**Learn:** Where each layer's truth lives: OpenStack services log under /var/log or journald and emit notifications. The control flow matters: nova-api takes the request, nova-conductor is the orchestrator/DB-proxy that nova-compute talks THROUGH (compute nodes do NOT touch the DB directly - conductor mediates), and nova-compute drives libvirtd on the host. virsh/virt-top expose per-domain CPU/mem/IO. You must correlate 'API says ACTIVE' vs 'libvirt says running' vs 'host actually healthy'.

**📚 Materials:**
- OpenStack Nova admin docs (docs.openstack.org/nova) -> architecture (nova-conductor, nova-compute) + troubleshooting
- OpenStack 'Logging and Monitoring' material in the Operations Guide (docs.openstack.org)
- libvirt.org docs + virsh(1) and virt-top(1) man pages
- prometheus openstack-exporter project README (github.com/openstack-exporter/openstack-exporter; verify URL)

**🔧 Hands-on:**
- Run virsh list --all, virsh dominfo <dom>, virsh domstats <dom>, and virt-top on the lab host
- Tail nova-compute + libvirtd logs while you 'openstack server create' and trace the VM through both
- journalctl -u libvirtd -f, then reboot the VM and watch the lifecycle events

**✅ Self-check:**
- A VM shows ACTIVE in 'openstack server list' but is unreachable - which 2 commands check libvirt/host truth?
- What is nova-conductor's role, and why don't compute nodes talk to the Nova DB directly?

## 3. Health-checks & Heartbeats (the Ping monitoring system)
*Why it matters:* Kagoya runs a 'Ping' monitoring system - you must understand exactly what a green ping proves and (crucially) does NOT prove, so you don't get a false sense of safety while a customer's VM is degraded. This is the dead-man's-switch that catches a host going dark.

### 3.1 Liveness vs readiness, push heartbeat vs pull probe, dead-man's-switch  _(4-5 hrs)_
**Learn:** Liveness = 'is it alive at all' (restart if not); readiness = 'can it serve right now' (pull from rotation if not). Pull probe = monitor reaches in and checks; push heartbeat = the thing periodically phones home and you ALARM ON SILENCE (dead-man's-switch) - silence itself is the signal, which catches whole-host/network death that a pull from the dead box couldn't report.

**📚 Materials:**
- Kubernetes docs 'Configure Liveness, Readiness and Startup Probes' (kubernetes.io) - canonical liveness/readiness definitions, transferable
- Prometheus Alertmanager docs + the well-known 'Watchdog'/'DeadMansSwitch' always-firing alert pattern (prometheus.io/docs/alerting/latest/alertmanager)
- SRE book Ch.6 'Monitoring Distributed Systems' (sre.google/sre-book/monitoring-distributed-systems)

**🔧 Hands-on:**
- Build a push heartbeat: a cron on the lab VM curls a Prometheus Pushgateway every 30s; wire an Alertmanager rule that fires when the heartbeat is ABSENT for 2 min; then 'poweroff' the VM and confirm the dead-man alert fires
- Build the contrasting pull probe (blackbox_exporter ICMP/TCP) and note what it CANNOT tell you when the host is fully dead

**✅ Self-check:**
- Why can a pull-based monitor MISS a totally dead host while a dead-man's-switch catches it?
- Give one liveness and one readiness check for nova-compute on a host.

### 3.2 What a green ping does and does NOT prove  _(3-4 hrs)_
**Learn:** ICMP ping up != VM healthy: the kernel can answer ping while the root filesystem is read-only, the app is dead, the qemu process is paused/suspended, or the customer's service is returning 500s. Layered checks (ICMP -> TCP port -> app/L7 -> customer-meaningful SLI) each prove more. Know the gap so monitoring honesty matches the SLA.

**📚 Materials:**
- The SRE Workbook 'Alerting on SLOs' chapter (symptom vs cause) (sre.google/workbook/alerting-on-slos)
- Rob Ewaschuk 'My Philosophy on Alerting' - the original Google alerting doc, public Google Doc (search by title; verify URL)
- ping(8) and fping(8) man pages

**🔧 Hands-on:**
- On a lab VM: keep ICMP up but 'mount -o remount,ro /' (or pause qemu via 'virsh suspend') and prove ping still goes green while the VM is useless
- Add a layered check: ICMP -> TCP:22 -> an HTTP 200 from a tiny service; break each layer and watch which checks catch it

**✅ Self-check:**
- Name three failure modes where ping stays green but the customer is down.
- For the new plan's SLA, is ICMP a sufficient SLI? What would you measure instead, and from where?

## 4. Thresholds, Alerting & Alert Fatigue
*Why it matters:* Bad alerting is how good engineers burn out and miss the ONE alert that mattered. You set thresholds for hundreds of hosts/VMs; you must make alerts actionable+urgent+rare, suppress flapping, and shout loudest on the things that hit MANY customers (a sick hypervisor) over a single VM.

### 4.1 Actionable + urgent + rare; symptom-based alerting; alert on customer impact  _(4-5 hrs)_
**Learn:** Every page must be all three: actionable (a human can DO something now), urgent (can't wait for morning), rare (else it's noise). Prefer symptom-based (customer-visible) alerts over cause-based. Severity should scale with blast radius: a failing hypervisor (many VMs) > one VM.

**📚 Materials:**
- SRE book Ch.6 'Monitoring Distributed Systems' + Workbook 'Alerting on SLOs'
- Rob Ewaschuk 'My Philosophy on Alerting' (verify URL)
- Prometheus docs 'Alerting best practices' (prometheus.io/docs/practices/alerting)

**🔧 Hands-on:**
- Write 5 Prometheus alerting rules for the lab: host-down (dead-man), compute free-RAM low, Cinder backend near-full, libvirtd down, sudden drop in VM-count-on-host; tag severity by number of customers affected
- Audit each: is it actionable/urgent/rare? Delete or downgrade any that aren't

**✅ Self-check:**
- Classify: 'one VM at 90% CPU for 5 min' - page, ticket, or ignore?
- Why alert on 'host with 40 customer VMs unreachable' at higher severity than 'one VM down'?

### 4.2 for-duration, flapping/hysteresis, inhibition, and escalation policy  _(4-5 hrs)_
**Learn:** The 'for:' clause requires a condition to persist before firing (kills transient blips). Flapping = rapid fire/resolve; fix with hysteresis (different on/off thresholds), 'for:', and grouping. Inhibition lets a higher-level alert SUPPRESS its downstream alerts (host-down suppresses the per-VM-down storm). Escalation = who gets paged, when it bumps to the next person, and how a multi-customer event escalates to a declared incident.

**📚 Materials:**
- Prometheus docs 'Alerting rules' (the 'for' clause) + Alertmanager docs 'grouping, inhibition, silences' (prometheus.io/docs/alerting)
- Workbook 'Alerting on SLOs' (multi-window burn-rate alerts reduce both flapping and slow detection)
- PagerDuty Incident Response docs (response.pagerduty.com) for escalation-policy design

**🔧 Hands-on:**
- Add 'for: 5m' to your free-RAM alert; oscillate the metric and prove it no longer flaps
- Configure an Alertmanager inhibition rule so a 'host down' alert SUPPRESSES the 40 individual 'VM down' alerts from that host
- Set a 2-tier escalation (you -> senior) in Alertmanager routing

**✅ Self-check:**
- Why does 'for:' reduce pages but slightly increase MTTD - and when is that trade-off wrong?
- Write an inhibition rule that stops 40 VM-down pages when their host is already paged.

## 5. SLI / SLO / SLA & Error Budgets
*Why it matters:* The new plan makes a CONTRACTUAL promise (SLA). You must translate that into a measurable SLI and an internal SLO with margin, and use the error budget to answer the make-or-break question: 'can we AFFORD to ship this change / run this migration right now?'

### 5.1 SLI vs SLO vs SLA - definitions and how they nest  _(4-5 hrs)_
**Learn:** SLI = a measured number (e.g. % of minutes a VM is reachable from outside the host). SLO = your internal target for that SLI (e.g. 99.95%), set TIGHTER than the SLA so you have margin. SLA = the external contract + penalties. The SLA drives the SLO drives what you must instrument as the SLI.

**📚 Materials:**
- SRE book Ch.4 'Service Level Objectives' (sre.google/sre-book/service-level-objectives)
- The SRE Workbook 'Implementing SLOs' + 'SLO Engineering Case Studies' chapters
- Google 'The Art of SLOs' workshop materials (sre.google/resources - free; verify URL)

**🔧 Hands-on:**
- Define the new plan's availability SLI precisely (what counts as 'down', measured how, FROM WHERE - apply Topic 3's ping caveats)
- Compute the monthly downtime budget for 99.9% vs 99.95% vs 99.99% and write which one the plan's price can support

**✅ Self-check:**
- If the SLA is 99.9%, what's a sane SLO and why tighter?
- Convert 99.95% monthly into allowed minutes of downtime (show the math).

### 5.2 Error budgets as the change-control currency ('can we afford this?')  _(3-4 hrs)_
**Learn:** Error budget = 1 - SLO = the downtime you're ALLOWED to spend. Planned work (migrations, rollouts) and unplanned outages both draw it down. If the budget is exhausted, you freeze risky change. This is the explicit, numeric bridge between reliability and the new-plan rollout + CentOS 7 migration.

**📚 Materials:**
- SRE book Ch.3 'Embracing Risk' (error budget) + Workbook 'Implementing SLOs'
- Workbook 'Alerting on SLOs' (burn-rate alerts)
- Alex Hidalgo 'Implementing Service Level Objectives' (O'Reilly, 2020) - optional paid deep-dive

**🔧 Hands-on:**
- Build a simple error-budget spreadsheet for the new plan: SLO, budget minutes/month, estimate the downtime a COLD-migrate of N VMs would consume, decide go/no-go
- Write the rule explicitly: 'rollout proceeds only if remaining budget > planned-migration cost'

**✅ Self-check:**
- A migration step needs ~15 min downtime/VM x 200 VMs; does the budget cover it, and what changes the answer (live vs cold migrate)?
- Why does an exhausted error budget halt the CentOS 7 migration pace?

## 6. Incident Response
*Why it matters:* When a hypervisor with live customer VMs goes sick at 2am, a calm, rehearsed process is the difference between a 10-minute blip and a multi-hour, multi-customer outage. The infra owner's signature move is MITIGATE FIRST - get VMs off the sick host BEFORE you debug root cause.

### 6.1 The incident lifecycle: detect -> declare/severity -> MITIGATE FIRST -> resolve -> review (live-migrate vs evacuate)  _(5-6 hrs)_
**Learn:** Detect (alert), declare with a severity, then STOP THE BLEEDING before diagnosing. Critical Nova distinction: if the sick host is STILL RUNNING, LIVE-MIGRATE the VMs off it (no downtime, no data loss). 'nova evacuate' / 'openstack server evacuate' is the DIFFERENT tool for when the host is already DOWN - it rebuilds the instances on another host from SHARED storage (or from image), and it can lose any local-disk-only data. Clear roles (Incident Commander, Ops, Comms) prevent chaos. Resolution != root cause; mitigation comes first.

**📚 Materials:**
- SRE book Ch.14 'Managing Incidents' + Ch.13 'Emergency Response'
- PagerDuty Incident Response docs (response.pagerduty.com) - roles, severity, Incident Commander
- OpenStack Nova admin docs 'Migrate instances' and 'Evacuate instances' (docs.openstack.org/nova) - note the live-migrate-vs-evacuate difference

**🔧 Hands-on:**
- Lab drill A (host still up): declare a sev, then LIVE-MIGRATE all VMs off a 'sick' host to the second host; time MTTR and verify a continuous ping survives
- Lab drill B (host dead): hard-kill hostA, then 'openstack server evacuate' its VMs onto hostB from shared storage; note what would have been lost if storage were local
- Write a 1-page severity matrix (sev1 = many customers down, sev3 = single VM degraded) for your environment

**✅ Self-check:**
- A host shows ECC + SMART errors but VMs still run - what do you do in the FIRST 5 minutes, and do you live-migrate or evacuate?
- What is the exact difference between live-migrate and evacuate in Nova, and what data can evacuate lose?

### 6.2 Runbooks, on-call hygiene, and blameless postmortems  _(4-5 hrs)_
**Learn:** A runbook is a tested step-by-step for a known incident (links, exact commands, decision points). On-call needs sane rotation, handoff, and escalation. The postmortem is BLAMELESS (focus on systems/contributing factors, not who) and produces tracked action items so the SAME outage can't recur - closing the Day-2 loop.

**📚 Materials:**
- SRE book Ch.15 'Postmortem Culture: Learning from Failure' + the public example postmortem & template (sre.google/sre-book/example-postmortem)
- The SRE Workbook 'Incident Response' + 'Postmortem Culture' chapters
- PagerDuty 'Postmortems' + 'Being On-Call' guides (response.pagerduty.com)

**🔧 Hands-on:**
- Write a real runbook for 'compute host hardware-failing -> live-migrate VMs off' with exact commands from your lab drill
- Run a mock blameless postmortem on a self-inflicted lab outage (push a bad libvirt config); fill the Google template with timeline + tracked action items

**✅ Self-check:**
- Why must a postmortem be blameless to actually improve reliability?
- Name two qualities of a runbook that make it usable at 2am by a tired engineer.

## 7. Change Management & Safe Rollout
*Why it matters:* Most outages are caused by CHANGES - and you're about to make two big ones (new plan + CentOS 7 migration) across two production clouds. Safe-change discipline (peer review, change windows, canary->rack->fleet, tested rollback, Ansible as the safe-change vehicle) is what lets you ship without taking customers down.

### 7.1 Why changes cause outages; change windows, peer review, progressive rollout (canary->rack->fleet)  _(4-5 hrs)_
**Learn:** The single biggest CONTROLLABLE outage cause is your own changes. Mitigations: roll out PROGRESSIVELY (one host/canary -> one rack -> fleet) so blast radius stays small and you catch breakage early; require peer review; schedule risky work in low-traffic change windows; and define explicit health gates between stages.

**📚 Materials:**
- SRE book Ch.8 'Release Engineering' + Ch.7 'The Evolution of Automation at Google'
- The SRE Workbook 'Canarying Releases' chapter (sre.google/workbook/canarying-releases)
- Google/AWS 'progressive delivery' & 'canary deployment' concept docs (transferable)

**🔧 Hands-on:**
- Design a canary->rack->fleet plan for pushing the new flavor + a host config: pick the canary host, define the health gate (alerts green + a test VM boots AND live-migrates), and the promotion criteria
- Run it in the lab: change host A only, verify the gate, then 'promote' to host B

**✅ Self-check:**
- Why does canarying on ONE compute host limit blast radius vs a fleet-wide push?
- What health signals must be green before you promote a change from rack to fleet?

### 7.2 Tested rollback + Ansible as the safe-change tool (idempotency, --check, --diff, --limit, serial)  _(5-6 hrs)_
**Learn:** A change isn't safe without a REHEARSED rollback. Ansible is your safe-change vehicle: idempotent (re-runnable to the same end state), --check/--diff to preview, --limit to scope to the canary, tags and 'serial:' for batched/rolling rollouts to control blast radius. Caveat: --check is only as honest as your modules - command/shell tasks and external side effects may not be accurately previewed, so still canary. The same playbook discipline governs BOTH the new-plan rollout and the CentOS 7 -> modern migration.

**📚 Materials:**
- Ansible docs: 'Check mode (--check)', 'Patterns / --limit', 'Rolling update with serial' (docs.ansible.com)
- Jeff Geerling (geerlingguy) 'Ansible for DevOps' - chapters on idempotency and rolling deploys (much published free online; verify URL)
- Jeff Geerling YouTube 'Ansible 101' series

**🔧 Hands-on:**
- Write an Ansible playbook that adds the new flavor + volume-type; run with '--check --diff' then '--limit canaryhost'; add 'serial: 1' for host-by-host rollout
- Write and TEST the inverse playbook (remove flavor / revert config); practice the rollback against the canary

**✅ Self-check:**
- Why is '--check --diff' useful but NOT a guarantee of safety (what kinds of tasks does it not faithfully preview)?
- What makes a playbook idempotent, and why does that make rollout/rollback safer?

## 8. Live Migration — HANDS-ON
*Why it matters:* Live migration is THE tool that lets you patch/retire/evacuate hosts (and run the CentOS 7 migration) without customer downtime. But it has hard limits - local-disk/CPU-pinned/PCI-passthrough VMs can't plain-live-migrate, cold-migrate means downtime that spends SLA budget - and you must know exactly when each applies.

### 8.1 Live migration mechanics on shared storage (virsh migrate / nova live-migration; CPU-model match)  _(6-8 hrs)_
**Learn:** With SHARED storage, only RAM + device state moves (pre-copy iterates dirty pages until convergence, then a brief stop-and-copy to cut over; post-copy is an alternative for hard-to-converge guests). The destination CPU must expose the source's required features (CPU-model compatibility) or migration is refused or the guest faults; this is why a common/'min' CPU model across the cluster matters. Without shared storage you need block migration (--copy-storage-all), which also copies the disk and takes far longer.

**📚 Materials:**
- libvirt.org 'Migration' docs + virsh(1) man page (migrate, --live, --copy-storage-all)
- QEMU docs 'Live Migration' (qemu.org/docs) for pre-copy/post-copy convergence internals
- OpenStack Nova admin 'Live-migrate instances' + 'Configure CPU models' (docs.openstack.org/nova)

**🔧 Hands-on:**
- Two-host shared-storage lab (NFS or shared LVM/Ceph): virsh migrate --live --verbose <dom> qemu+ssh://hostB/system and verify a continuous ping survives (label the timing 'indicative' if on nested virt)
- Repeat via OpenStack: openstack server migrate --live-migration <id>
- Deliberately set incompatible CPU models, observe the refusal/fault, then fix with a common model

**✅ Self-check:**
- On shared storage, what state actually transfers during live migration - and what doesn't?
- Why must the destination CPU model be compatible, and how do you guarantee a compatible model cluster-wide?

### 8.2 Failure modes & realities: mid-flight failure, non-migratable VMs, cold-migrate downtime vs SLA, customer windows  _(6-8 hrs)_
**Learn:** Migration can fail (won't converge under heavy RAM dirtying, network drop) - it's transactional-ish: on failure the SOURCE keeps running, and you abort with 'virsh domjobabort'. Some VMs CAN'T plain live-migrate: local-disk-only (needs block migration or cold), CPU/NUMA-pinned, PCI-passthrough/SR-IOV/vGPU. Cold migrate = real downtime that SPENDS SLA error budget, so it requires a scheduled customer maintenance window.

**📚 Materials:**
- libvirt 'Migration' (failure/abort, --copy-storage-all for block) + virsh domjobabort
- OpenStack Nova admin 'Cold migrate instances' + 'Troubleshoot live migration' (docs.openstack.org/nova)
- RHEL 'Configuring and managing virtualization' -> migrating virtual machines guide (access.redhat.com) for migratability constraints

**🔧 Hands-on:**
- Force a non-converging migration (run 'stress-ng --vm 2 --vm-bytes 80%' in the guest to dirty RAM fast), watch it stall, then 'virsh domjobabort' and confirm the SOURCE VM is unharmed
- Cold-migrate a local-disk VM ('openstack server migrate' WITHOUT --live-migration) and measure the real downtime; map it to the error-budget cost from Topic 5
- Take a PCI-passthrough/pinned VM and prove plain live migration is refused

**✅ Self-check:**
- Name three VM properties that block plain live migration and the fallback for each.
- A 200-VM CentOS 7 host needs migration; which VMs need a customer maintenance window and why?

## 9. Security as an Owned Discipline
*Why it matters:* You own the hypervisor - the trust boundary between tenants. The single scariest part of CentOS 7 EOL is an UNPATCHED qemu-kvm/libvirt/kernel with a VM-escape CVE, which breaks tenant isolation. You also hold the Infra API's Keystone credentials, the keys to the whole cloud.

### 9.1 VM-escape / QEMU-KVM & libvirt attack surface; why CentOS 7 EOL is a security emergency  _(4-5 hrs)_
**Learn:** A VM-escape lets a guest break out into the host (historic QEMU device-emulation CVEs such as VENOM, CVE-2015-3456), collapsing tenant isolation - the worst thing that can happen to a multi-tenant host. After CentOS 7 EOL (2024-06-30) you stop getting qemu-kvm/libvirt/kernel security patches, so a NEW escape CVE has NO fix on those hosts. This is the reliability-AND-security driver for the migration. Note the layered model: KVM (kernel) does the CPU/MMU virtualization; most of the historically risky attack surface is in QEMU's emulated DEVICES, which is exactly what sVirt/SELinux confinement is designed to box in.

**📚 Materials:**
- Red Hat Security Advisories / CVE database for qemu-kvm & libvirt (access.redhat.com/security)
- NVD / MITRE CVE entries for QEMU (e.g. VENOM CVE-2015-3456 as a teaching case)
- QEMU docs 'Security' (qemu.org/docs) on the trust model / device-emulation surface
- libvirt.org 'Security' + sVirt/SELinux confinement docs

**🔧 Hands-on:**
- On the lab host, confirm sVirt/SELinux is ENFORCING for qemu ('getenforce'; 'ps -eZ | grep qemu' shows the per-VM svirt_t label) - this is a key escape-mitigation layer even before a patch exists
- Pull the installed qemu-kvm package version on a CentOS-7-like host and cross-check it against current Red Hat advisories to see what's unpatched

**✅ Self-check:**
- Why is an unpatched qemu-kvm scarier on a MULTI-tenant host than a single-tenant box?
- How does sVirt/SELinux reduce the blast radius of a QEMU device bug even before a patch exists?

### 9.2 Host firewall (firewalld iptables->nftables backend), secrets management, TLS/cert management, CVE triage  _(5-6 hrs)_
**Learn:** Two host-security shifts you'll hit during the EL7->modern move: (1) The host FIREWALL backend changes - on EL7 firewalld drives the iptables engine, on EL8+ firewalld defaults to the nftables backend; your firewall automation must not assume raw iptables rules survive the jump. (2) Your Infra API holds Keystone admin-ish creds - never in code/repos; use a secrets store, least-privilege service accounts, rotation. TLS everywhere (API endpoints, internal OpenStack), and certs EXPIRE (track + auto-renew or you self-inflict an outage). CVE triage = score by exploitability + exposure (CVSS, is it actually reachable in YOUR setup?), then patch on a cadence with an emergency-patch path for criticals.

**📚 Materials:**
- RHEL 'Securing networks' -> 'Getting started with firewalld' / nftables backend notes (access.redhat.com); firewalld.org docs
- OWASP 'Secrets Management Cheat Sheet' (cheatsheetseries.owasp.org)
- HashiCorp Vault docs OR Ansible Vault docs (whichever you'll use) for storing the Keystone creds
- OpenStack Security Guide (docs.openstack.org/security-guide) -> API endpoints/TLS + Keystone; FIRST.org CVSS v3.1 spec; Red Hat 'Security Errata' guidance

**🔧 Hands-on:**
- Check the firewalld backend on an EL8+ lab host ('grep FirewallBackend /etc/firewalld/firewalld.conf' -> nftables) vs EL7, and confirm your firewall playbook works on both
- Move a hardcoded Keystone credential from a sample Infra-API config into Ansible Vault (or Vault); prove the repo no longer contains the secret
- Check a TLS cert's expiry ('openssl x509 -enddate -noout -in cert.pem') and set an alert before expiry; then triage one real recent qemu CVE for reachability and write the patch/no-patch decision

**✅ Self-check:**
- What changes about the host firewall when you move a host from EL7 to EL8+, and what could silently break?
- Where should the Infra API's Keystone password live, how is it rotated, and what's your 'patch tonight' vs 'next window' criterion for a libvirt CVE?

## 10. Backups & Disaster Recovery
*Why it matters:* When a Cinder backend or a control-plane DB dies, 'we have backups' is meaningless unless they're restore-TESTED and you know your RPO/RTO. With TWO independent OpenStack deployments you must decide: is the second a real DR site or just two single-points-of-failure? And you must know the contractual truth: does Kagoya back up customer VMs at all?

### 10.1 RPO/RTO, the full backup-layer map, and 'a snapshot is NOT a backup'  _(5-6 hrs)_
**Learn:** RPO = max acceptable data LOSS (how old can the last backup be); RTO = max acceptable time to RESTORE. Each layer needs its own RPO/RTO: customer VM data, Glance images, Cinder volume backends, control-plane DBs (Keystone, Glance registry, Placement, plus the Galera/MySQL or PostgreSQL behind them), and the Ansible/IaC that can rebuild the cloud itself. CRUCIAL distinction: a SNAPSHOT is not a backup - it usually lives on the SAME backend (dies with it), is often copy-on-write so it depends on the original, has no independent retention, and isn't restore-tested. A Cinder volume BACKUP (independent target) is. A backup nobody restored is a hope, not a backup.

**📚 Materials:**
- SRE book Ch.26 'Data Integrity: What You Read Is What You Wrote' (sre.google/sre-book/data-integrity)
- OpenStack docs: Cinder 'Back up and restore volumes and snapshots', Glance image management, Operations Guide 'Backup and recovery' (docs.openstack.org)
- PostgreSQL docs 'Backup and Restore' (pg_dump / PITR) + MariaDB/Galera 'mariabackup' docs

**🔧 Hands-on:**
- Back up and RESTORE a Cinder VOLUME ('openstack volume backup create' -> delete the volume -> restore) and verify data; then prove a same-backend snapshot does NOT survive deleting the backend
- pg_dump a Postgres control DB and restore it into a scratch instance; time the RTO
- Snapshot a VM via Glance, delete the VM, rebuild from the snapshot - and write down why this is still not a 'backup'

**✅ Self-check:**
- State an RPO and RTO for (a) a customer VM and (b) the Keystone DB, and why they differ.
- Give three concrete reasons a snapshot is not a backup.

### 10.2 DR across two deployments (DR site vs two SPOFs) + the contractual backup question  _(5-6 hrs)_
**Learn:** Two independent clouds only give DR if one can take over OR restore the other's data/role - otherwise they're just two independent failure domains (two SPOFs). Decide a replication/restore strategy and reconcile differences. Separately, KNOW THE CONTRACT: many VPS providers make customer-VM backup the CUSTOMER's responsibility - confirm Kagoya's actual policy and never promise what the SLA doesn't.

**📚 Materials:**
- SRE book Ch.26 + The SRE Workbook material on data integrity / regional isolation (DR thinking)
- OpenStack 'multi-region' deployment docs + Cinder backup-to-remote (docs.openstack.org)
- Kagoya Cloud VPS official terms/規約 & support docs on backup responsibility (kagoya.jp; verify exact page) - confirm what is contractually backed up

**🔧 Hands-on:**
- Write a DR matrix: each layer x {backed-up where, replicated to other deployment?, restore-tested?, RPO, RTO}
- Tabletop: 'Deployment A's Cinder backend is destroyed' - walk the recovery using ONLY what you actually have, and time the RTO
- Read Kagoya's published backup policy and write one sentence: 'we DO / do NOT back up customer VM data'

**✅ Self-check:**
- Are your two deployments a DR pair or two SPOFs? What single change would make them a true DR pair?
- If a customer loses their VM data, does the contract obligate Kagoya to restore it?

## 11. Capacity as a Procurement Discipline
*Why it matters:* Because Kagoya bills FIXED (not metered), you must have hardware ready BEFORE you sell the new plan - and servers have weeks-long lead times. Under-provision and you can't fulfill orders (or you over-pack and break SLAs); over-provision and you waste capital. You must forecast and reconcile BOTH deployments.

### 11.1 Forecasting growth, allocation ratios, hardware lead-time, N+1, and launch reservation  _(4-5 hrs)_
**Learn:** Capacity planning = predict demand (trend + the new-plan launch spike), translate to hosts (CPU/RAM/disk/IO with the Placement allocation ratios factored in), and order EARLY because hardware lead time is long. Reserve headroom for launch demand AND for N+1 (so you can LOSE a host or EVACUATE one for migration without running out of room - this is what makes Topic 8's live-migration plan actually executable). Note: RAM overcommit is far riskier than CPU overcommit (you can't oversell RAM the way you time-slice CPU without swapping/OOM).

**📚 Materials:**
- SRE book Ch.18 'Software Engineering in SRE' + The SRE Workbook 'Managing Load' (capacity & headroom thinking)
- OpenStack docs: Nova 'Flavors', 'Configure overcommit / allocation ratios (cpu/ram/disk)', and the Placement service (docs.openstack.org)
- OpenStack Watcher (resource optimization) docs for utilization/optimization (docs.openstack.org)

**🔧 Hands-on:**
- From 'openstack hypervisor list' / 'openstack hypervisor stats show' and Placement, compute current allocation ratios and free capacity per host
- Build a forecast sheet: current trend + expected new-plan VMs -> hosts needed -> order-by date given an 8-week lead time + N+1 headroom

**✅ Self-check:**
- Why must you order hardware before the new plan launches, and how do you size the launch reservation?
- What is N+1 headroom and why does the live-migration/evacuation requirement (Topic 8) demand it? Why is RAM overcommit riskier than CPU?

### 11.2 Reconciling capacity across BOTH deployments  _(3-4 hrs)_
**Learn:** Two independent clouds = two capacity pools that don't auto-balance (they are SEPARATE clouds with their own Keystone, NOT two regions of one cloud, so there's no cross-cloud scheduler). You must track each separately, decide which gets the new plan (or both), and avoid 'one cloud is full while the other is idle.' Reconciliation = consistent flavors/quotas/allocation ratios and a combined planning view.

**📚 Materials:**
- OpenStack Placement + Nova quota/flavor docs (specs must MATCH across deployments)
- OpenStack Operations Guide capacity/maintenance sections (docs.openstack.org)
- The SRE Workbook 'Managing Load' (load-distribution thinking)

**🔧 Hands-on:**
- Produce a single side-by-side capacity report for both (mock) deployments: total/used/free, allocation ratios, where the new flavor fits
- Diff the new flavor + volume type across both deployments to PROVE the specs are identical

**✅ Self-check:**
- What goes wrong if the same plan has different allocation ratios in the two clouds?
- Why can't an idle second cloud automatically absorb the first cloud's overflow, and how do you decide which deployment takes launch demand?

## 12. Multi-Tenant Reliability
*Why it matters:* Many customers share each host. Your core reliability job is ISOLATION and limiting blast radius so one tenant's spike, abuse, or crash can't hurt the neighbors - and so a hardware fault takes down a known, bounded set via fault domains and anti-affinity.

### 12.1 Isolation & noisy-neighbor control (per-tenant quotas, cgroups/CPU/IO limits)  _(4-5 hrs)_
**Learn:** Multi-tenancy needs enforced resource boundaries: OpenStack QUOTAS cap what a tenant can REQUEST; the hypervisor (cgroups, CPU shares/quota, blkio/IO throttling via libvirt <cputune>/<blkiotune>/<memtune>) caps what a RUNNING VM can CONSUME so it can't starve neighbors. Quotas protect the cloud's accounting; per-VM limits protect the host's other VMs. Note the cgroup-version nuance: EL7 uses cgroup v1, EL8/9 default to cgroup v2 - libvirt's resource knobs map differently, so re-verify throttling after the migration.

**📚 Materials:**
- OpenStack docs: Nova/Cinder/Neutron 'Manage quotas' (docs.openstack.org)
- libvirt domain XML docs: <cputune>, <blkiotune>, <memtune> (libvirt.org)
- Brendan Gregg 'Systems Performance' 2nd ed. chapters on cgroups/resource control + cgroups(7) man page

**🔧 Hands-on:**
- Set a Nova quota for a test project and prove the (N+1)th VM request is REJECTED
- Add an IO throttle to a lab VM via libvirt <blkiotune> (or 'virsh blkdeviotune'); run 'fio' inside it and confirm a neighbor VM's IO stays healthy

**✅ Self-check:**
- Difference between a QUOTA and a per-VM resource LIMIT - which one actually stops a noisy neighbor?
- Which libvirt knobs cap a VM's IO and CPU, and what changes about them between cgroup v1 (EL7) and v2 (EL8+)?

### 12.2 Blast radius, fault domains, and anti-affinity  _(3-4 hrs)_
**Learn:** Design so a single failure hits a bounded, KNOWN set. Fault domains = independent failure units (host, rack, power feed, separate deployment). Anti-affinity (Nova server groups) spreads a customer's (or a service's) VMs across hosts so one host loss doesn't take them all down - directly shrinking blast radius. Caveat: a server group's anti-affinity is enforced at SCHEDULE time, so it can only help customers who actually requested multiple VMs in a group.

**📚 Materials:**
- OpenStack Nova docs: 'Server groups' (affinity/anti-affinity) + scheduler filters (docs.openstack.org/nova)
- SRE book Ch.3 (failure isolation) + Workbook material on sharding/cells
- Cloud-provider 'fault domains / availability zones' concept docs (transferable mental model)

**🔧 Hands-on:**
- Create an anti-affinity server group, boot 2 VMs into it, and prove via 'openstack server show' they landed on DIFFERENT hosts
- Map your lab's fault domains (which VMs share a host/rack/power) and identify the worst-case blast radius of one host loss

**✅ Self-check:**
- How does anti-affinity reduce a customer's blast radius when a host dies, and what's its limitation?
- Name three fault-domain levels in a VPS deployment and what failure each one contains.

## 13. Public-IP Inventory & Abuse
*Why it matters:* Every VPS needs a public IP, IPv4 is FINITE and scarce, and a customer VM that gets compromised can poison your IP ranges' reputation (blocklists) - hurting OTHER customers on neighboring IPs. Managing the pool, abuse, reputation, IPv6, and reverse-DNS is squarely infra-owner work.

### 13.1 Finite IPv4 pool management, floating IPs vs provider networks, and IPv6 rollout  _(3-4 hrs)_
**Learn:** You have a bounded IPv4 allocation; track assignment/reclamation tightly (an IP leaks if a terminated VM's address isn't returned - ties to the lifecycle in Topic 14). Know the Neutron distinction: a FLOATING IP is a NAT mapping from an external pool onto a VM's private port (associate/disassociate on demand), whereas a PROVIDER (flat/VLAN) network gives the VM a 'real' routable address directly with no NAT - VPS hosts commonly use one or the other and the IP-accounting and reclamation paths differ. IPv6 gives effectively unlimited addresses and is the structural long-term fix; plan dual-stack.

**📚 Materials:**
- OpenStack Neutron docs: 'Floating IP addresses', 'Provider networks', 'Subnet pools', 'IPv6' (docs.openstack.org/neutron)
- APNIC IPv4 exhaustion + IPv6 deployment guides (apnic.net) - the relevant RIR for Japan
- JPNIC IP address policy / 割り当て docs (nic.ad.jp; verify URL) for the Japanese registry context

**🔧 Hands-on:**
- In Neutron, create an external allocation pool, allocate a FLOATING IP to a VM, delete the VM, and verify the IP is RECLAIMED (or detect the leak)
- Boot a VM on a provider network instead and note how its IP assignment/reclamation differs from the floating-IP path
- Enable IPv6 (SLAAC) on a lab subnet and confirm the VM gets a v6 address

**✅ Self-check:**
- What's the difference between a floating IP and a provider-network address, and how does each get reclaimed?
- How does a terminated VM leak an IPv4 address, and where in the lifecycle do you prevent it?

### 13.2 Abuse handling, IP reputation/blocklists, and reverse-DNS delegation  _(3-4 hrs)_
**Learn:** A compromised customer VM sending spam/DDoS gets your IP RANGE blocklisted (Spamhaus etc.), harming neighbors - so you need an abuse process (detect, notify/suspend the customer, request delisting). Reverse DNS (PTR) is often required for outbound mail and is delegated to you for your ranges; customers may need a PTR for their IP.

**📚 Materials:**
- Spamhaus blocklist + delisting documentation (spamhaus.org) - how ranges get listed/removed
- Your RIR's reverse-DNS delegation guide (APNIC 'reverse DNS' docs) + PTR/in-addr.arpa concepts
- OpenStack Designate (DNSaaS) docs for PTR / reverse zones (docs.openstack.org/designate)
- M3AAWG abuse-handling best-practice documents (m3aawg.org)

**🔧 Hands-on:**
- Set a PTR record for a lab IP (via Designate or a local authoritative zone) and verify with 'dig -x <ip>'
- Write an abuse runbook: alert -> identify owning VM/customer -> suspend (Topic 14 lifecycle) -> request delisting

**✅ Self-check:**
- Why does one abusive VM hurt OTHER customers sharing your IP range?
- What's the suspend-vs-terminate decision when a customer VM is found attacking others?

## 14. Business Context (the 'why' behind the infra)
*Why it matters:* Your infra decisions are economic. Kagoya's FIXED (non-metered) billing makes overcommit economically necessary, the flavor<->plan<->price mapping is what you're really shipping, and the VM lifecycle crosses YOUR Infra API to drive billing. Misunderstand this and you'll build infra that loses money or mis-bills customers.

### 14.1 VPS vs shared/dedicated/cloud; flavor<->plan<->price; fixed billing -> why overcommit; the flavor disk=0 trap; EC2 metered contrast  _(3-4 hrs)_
**Learn:** VPS = an isolated, guaranteed-ish slice of a shared host (between cheap shared hosting and pricey dedicated; less elastic than hyperscale cloud). A 'plan' the customer buys = a 'flavor' you define (vCPU/RAM/root-disk) at a fixed price. Because billing is fixed monthly/daily (NOT metered like EC2's pay-per-use), you MUST overcommit CPU (and cautiously RAM) to be profitable - the business model forces the capacity strategy. Concrete trap to internalize: a Nova flavor with disk=0 means 'no root-disk size limit imposed by the flavor' - for a boot-from-volume plan that may be intentional, but for an ephemeral-disk plan it creates an unbounded/ambiguous root disk; always set root/ephemeral sizes deliberately and match them to the Cinder volume type.

**📚 Materials:**
- OpenStack Nova 'Flavors' docs (incl. the disk field semantics / root_gb) + 'allocation ratio / overcommit' docs (docs.openstack.org/nova)
- Kagoya Cloud VPS plans/pricing page (kagoya.jp) - real flavor<->plan<->price and fixed billing
- AWS EC2 pricing docs (on-demand / per-second) as the METERED contrast (aws.amazon.com/ec2/pricing)

**🔧 Hands-on:**
- Define a flavor matching a chosen 'plan' (e.g. 2 vCPU / 4 GB / 80 GB), DELIBERATELY set disk!=0 (or document why boot-from-volume uses disk=0), and write its price + the implied overcommit ratio to break even
- Compute: at fixed price X/mo, how many such VMs per host (with overcommit) to break even vs running 1:1

**✅ Self-check:**
- Why does fixed (non-metered) billing make overcommit economically necessary, and what reliability risk does that create?
- What does flavor disk=0 actually mean, and when is it correct vs dangerous?

### 14.2 VM lifecycle across the Infra API (order->create->active->suspend/shelve->terminate->reclaim) and billing hooks  _(4-5 hrs)_
**Learn:** The lifecycle crosses YOUR Infra API, which is where billing events fire and where resources (IPs from Topic 13, disk, quota) are actually allocated and RECLAIMED. Watch the Nova state nuances: SUSPEND saves VM state to disk but the instance still OCCUPIES host RAM/disk and (usually) its IP, whereas SHELVE actually frees host resources (and can release the IP) - so the right 'stop billing but keep data' action depends on which one your billing model means. TERMINATE = delete + reclaim. A missed reclaim = leaked resource and/or a wrong bill.

**📚 Materials:**
- OpenStack Nova 'Server (VM) states' / instance lifecycle actions docs - ACTIVE, SUSPENDED, SHELVED, SHUTOFF, DELETED (docs.openstack.org/nova)
- OpenStack notifications / Telemetry (Ceilometer) docs - the events a billing system consumes (docs.openstack.org)
- Nova 'shelve/unshelve' and 'delete' semantics (what each one reclaims) docs

**🔧 Hands-on:**
- Drive the full lifecycle on a lab VM: create -> 'openstack server show' (ACTIVE) -> suspend -> shelve -> delete, watching the state transitions AND confirming what each step does (or does not) reclaim for IP/disk/RAM/quota
- Capture the Nova notification/event emitted on create and on delete (the billing seam)

**✅ Self-check:**
- What's the resource difference between SUSPEND and SHELVE, and which one really 'stops billing but keeps data' for your model?
- Which lifecycle events must cross the Infra API to bill correctly, and what breaks if a reclaim is missed?

## 15. Japanese SI Delivery Awareness
*Why it matters:* You work inside a Japanese SI structure with vendors and acceptance gates. You don't need to be a lawyer, but you MUST recognize the terms (要件定義/検収/報連相 and the contract types 準委任/請負/派遣) so you know who's accountable, what 'done' means, and - critically - to ESCALATE when you smell the illegal 偽装請負 trap rather than acting on it yourself.

### 15.1 Delivery vocabulary: 要件定義, 検収, 報連相, vendor work, 常駐 vs remote  _(3-4 hrs)_
**Learn:** 要件定義 = requirements definition (agree WHAT before building). 検収 = formal acceptance test where the buyer verifies deliverables meet spec before sign-off/payment - your new-plan rollout passes through this gate. 報連相 (報告・連絡・相談 = report / contact-keep-informed / consult) is the expected communication discipline. 常駐 = working on-site at the client vs remote. Vendors do chunks of work under a contract type (next subtopic).

**📚 Materials:**
- IPA (情報処理推進機構) 'モデル取引・契約書' (model SI transaction/contract documents) and 共通フレーム - define the 要件定義/検収 flow (ipa.go.jp; verify exact page)
- Reputable Japanese business primers on 報連相 (prefer .go.jp / established .co.jp explainers)
- IPA software-development process guides on acceptance(検収) (ipa.go.jp; verify exact page)

**🔧 Hands-on:**
- Write a one-paragraph 要件定義 for the new plan (vCPU/RAM/disk/price/SLA) AND a 検収 checklist a buyer would run to accept it (boots, live-migrates, billed correctly, SLA-measurable)
- Draft a 報連相-style status update for a delivery milestone (報告 of progress + what you need to 相談 about)

**✅ Self-check:**
- What exactly happens at 検収, and why does your rollout plan (Topics 7/16) need to satisfy it?
- When do you 相談 (consult before acting) vs just 報告 (report after) on a risky change?

### 15.2 Contract types (準委任 vs 請負 vs 業務委託 vs 派遣) and the 偽装請負 trap - KNOW & ESCALATE  _(4-5 hrs)_
**Learn:** 請負 = contract for a completed DELIVERABLE (vendor bears completion responsibility incl. defect liability; the client may NOT directly command the vendor's workers). 準委任 = contract for EFFORT/services (no completion guarantee; client still can't directly command the workers). 派遣 = dispatched labor where the client DOES direct the worker day-to-day (regulated under the 労働者派遣法). 業務委託 = umbrella business term covering 請負/準委任. The ILLEGAL 偽装請負 ('disguised contracting') trap = a 請負/準委任 in name but the client actually commands the workers like 派遣 - a labor-law violation. You must RECOGNIZE the smell and ESCALATE to management/legal, not decide it yourself.

**📚 Materials:**
- 厚生労働省 (MHLW): 労働者派遣事業と請負により行われる事業との区分に関する基準 (告示37号) + 偽装請負 guidance on mhlw.go.jp - the canonical legal distinction (verify exact page)
- IPA / METI model-contract docs distinguishing 請負 vs 準委任 (ipa.go.jp / meti.go.jp; verify page)
- Reputable Japanese legal/HR explainers on 準委任・請負・派遣・業務委託 (prefer .go.jp or 弁護士-authored sources)

**🔧 Hands-on:**
- Make a 4-column table: 請負 / 準委任 / 派遣 / 業務委託 x {pays for deliverable or effort?, who bears completion responsibility?, who may direct the worker?, 偽装請負 risk?}
- Write the 3-line escalation message you'd send if you noticed your team directing a 請負 vendor's engineers day-to-day

**✅ Self-check:**
- What single factor most distinguishes 派遣 from 請負, and why does blurring it create 偽装請負?
- You're told to assign daily tasks directly to a vendor's 請負 engineer - what do you do, and what do you NOT do?

## 16. End-to-End New-Plan Synthesis (capstone integration)
*Why it matters:* This is the whole job in one thread: take the new plan from spec to live, billed, monitored capacity across BOTH deployments, while the CentOS 7 modernization runs as a parallel safe-change track. Everything in Phases 1-6 converges here; this is what 'owning the Infra layer' actually means.

### 16.1 Spec -> flavor in BOTH deployments -> KVM capacity math -> Infra API extension -> Backend/Control-Panel wiring -> staging  _(6-8 hrs)_
**Learn:** Drive the end-to-end build: turn the 要件定義 into an OpenStack flavor (with deliberate disk/extra_specs, Topic 14) + a Cinder volume type defined IDENTICALLY in both SEPARATE clouds (each its own Keystone, so you apply the change TWICE - there is no shared scheduler); verify KVM/host capacity holds the forecast (Topic 11) at the chosen overcommit with N+1 headroom; extend YOUR Infra API to expose the new plan and its lifecycle/billing hooks (Topic 14); coordinate the seam with the Backend/Control-Panel owner; validate end-to-end in staging before ANY production exposure.

**📚 Materials:**
- OpenStack Nova 'Flavors' + Cinder 'Volume types' admin docs (docs.openstack.org)
- OpenStack Placement / Nova allocation-ratio & capacity docs (Topic 11 sources)
- Your own Infra API contract/spec + the OpenStack API reference (docs.openstack.org/api-ref) for what the Infra API wraps

**🔧 Hands-on:**
- End-to-end in lab: define the flavor + volume type in BOTH (mock) deployments, do the capacity math for N forecast VMs, add an Infra API endpoint that creates a VM on the new plan and emits a create event, and run it through staging
- Diff the flavor / volume-type definitions across deployments to PROVE parity

**✅ Self-check:**
- What must be true in BOTH deployments before the plan can launch, and why does 'both' require applying the change twice?
- Where in the Infra API do create/terminate cross into billing, and how did you test that seam in staging?

### 16.2 検収/rollout -> capacity monitoring -> live ops, with CentOS 7 modernization as a parallel track  _(6-8 hrs)_
**Learn:** Tie delivery to ops: pass 検収 (Topic 15), roll out canary->rack->fleet across both clouds with tested Ansible rollback (Topic 7), then watch SLOs/error budget and capacity/utilization (Topics 5, 11) as real customers arrive. Run modernization in PARALLEL using the SAME safe-change + live-migration discipline (Topics 7, 8) to move VMs off CentOS 7 hosts onto modern hosts before EOL bites via unpatched qemu/kernel (Topic 9). Be realistic about the OS move: EL7 CANNOT jump straight to EL9 in place - the workable paths are (a) build fresh modern (Rocky/Alma/RHEL-family) hosts and LIVE-MIGRATE workloads onto them (cleanest for a hypervisor fleet), or (b) in-place ELevate/leapp EL7->EL8 then EL8->EL9. Spend error budget deliberately.

**📚 Materials:**
- SRE book Ch.8 'Release Engineering' + The SRE Workbook 'Canarying Releases'
- EL7 migration tooling & EOL facts: Rocky migrate2rocky (EL7->Rocky 7), AlmaLinux ELevate / leapp (EL7->EL8->EL9 - no single-step EL7->EL9), Red Hat Convert2RHEL (rockylinux.org / almalinux.org / access.redhat.com)
- OpenStack 'upgrade' docs + Nova live-migration/evacuate docs (Topic 8 sources)

**🔧 Hands-on:**
- Write + rehearse the combined plan: 検収 checklist -> canary->rack->fleet rollout (both clouds) -> rollback playbook -> SLO/capacity dashboard; THEN a parallel host-migration runbook that live-migrates VMs off a 'CentOS 7' host onto a modern host and decommissions the old one
- Run one full slice in the lab end-to-end and capture MTTR / downtime / error-budget spend (label nested-virt timings as indicative)

**✅ Self-check:**
- How does the SAME change-management + live-migration toolkit serve BOTH the plan rollout and the CentOS 7 migration?
- Why can't you upgrade an EL7 hypervisor straight to EL9, and what's your go/no-go signal to keep migrating hosts vs pause (hint: error budget + N+1 capacity headroom)?

## 🎯 Phase capstone
Produce a complete, runnable "New VPS Plan — Ops & Delivery Runbook" plus a working migration drill, defended in a mock 検収 (acceptance) review. Deliverables: (1) In your 2-host shared-storage KVM lab, define the new plan as an OpenStack flavor (with sane extra_specs, and a DELIBERATE check that disk!=0 so you don't silently create an unbootable/unbounded-root-disk flavor) + a Cinder volume type, boot a test VM on it, then LIVE-MIGRATE that VM host->host with virsh/nova at zero data loss, AND demonstrate one cold-migrate and one deliberately-failed-then-recovered migration (use virsh domjobabort and confirm the source VM is unharmed). (2) A one-page SLI/SLO sheet for the new plan (SLI definition measured from OUTSIDE the host, SLO target set tighter than the SLA, error budget in minutes/month, explicit 'can we afford this rollout' budget check). (3) An incident runbook for 'hypervisor showing SMART/ECC errors' that goes detect->declare severity->MITIGATE FIRST (live-migrate VMs off the sick host while it still runs; fall back to nova evacuate only if the host is already dead and storage is shared)->resolve->blameless postmortem (Google postmortem template). (4) A canary->rack->fleet rollout plan for BOTH deployments with a tested Ansible rollback, reused as the CentOS 7->modern-host migration plan (note: EL7 cannot in-place jump straight to EL9 - the realistic paths are reinstall-and-migrate-workloads, or ELevate/leapp EL7->EL8 then EL8->EL9). (5) A backup/DR matrix covering every layer (VM data, Glance images, Cinder volumes/backups, control-plane DBs Keystone/Glance/Placement + Galera/MySQL or PostgreSQL, Ansible/IaC config) with RPO/RTO, restore-TESTED flags, and an explicit note that a snapshot is NOT a backup (same backend, not independently restore-tested, no retention guarantee), plus the honest 'does Kagoya back up customer VMs?' contractual answer. (6) A capacity forecast reconciling both clouds with hardware lead-time + N+1 headroom. (7) A half-page memo using correct Japanese-SI terms (要件定義/検収/報連相 and 準委任 vs 請負) describing how you'd escalate a delivery-risk or 偽装請負-smell question. Pass criteria: every claim in the runbook is something you actually ran or could run, you correctly label any nested-virt-only result as indicative, and a reviewer role-playing 'another engineer / the customer' cannot find a step that would take a customer VM down silently.

## 🧰 Primary resources for this phase
- Google SRE books - 'Site Reliability Engineering' (Beyer et al.) and 'The Site Reliability Workbook' - FREE in full at sre.google/books. Verified chapter map for the SRE book: Ch.3 Embracing Risk, Ch.4 Service Level Objectives, Ch.5 Eliminating Toil, Ch.6 Monitoring Distributed Systems, Ch.8 Release Engineering, Ch.13 Emergency Response, Ch.14 Managing Incidents, Ch.15 Postmortem Culture, Ch.18 Software Engineering in SRE, Ch.26 Data Integrity. Workbook key chapters: Implementing SLOs, Alerting on SLOs, Eliminating Toil, Incident Response, Postmortem Culture, Managing Load, Canarying Releases.
- OpenStack official docs at docs.openstack.org - Operations Guide; Nova admin (flavors incl. extra_specs and the disk=0 caveat, live-migration, cold migrate, evacuate, server states, server groups, quotas, CPU models, allocation ratios); Cinder (volume types, volume backups); Glance; Keystone; Placement; Neutron (floating IPs, provider networks, subnet pools, IPv6); Watcher
- libvirt + KVM + QEMU upstream docs - libvirt.org (Migration, domain XML <cputune>/<blkiotune>/<memtune>, sVirt/SELinux confinement) and the virsh(1) man page; qemu.org documentation (Live Migration internals, Security model). Note: KVM is the in-kernel virtualization module that turns Linux into a hypervisor; QEMU provides device emulation; libvirt is the management API on top.
- Prometheus + Grafana + Alertmanager docs (prometheus.io/docs, grafana.com/docs) and Brendan Gregg 'Systems Performance' (2nd ed., 2020) + brendangregg.com (the USE Method page; cgroups). For exporters: prometheus node_exporter and blackbox_exporter docs.
- EL7->modern migration tooling and EOL facts: CentOS 7 went EOL 2024-06-30 (no more upstream patches). Realistic moves off EL7: Rocky Linux migrate2rocky (EL7->Rocky 7 only; verify URL), AlmaLinux ELevate / leapp (in-place MAJOR-version upgrade EL7->EL8, then EL8->EL9 - there is NO single-step EL7->EL9), Red Hat Convert2RHEL, or reinstall-and-migrate-workloads. Docs at rockylinux.org / almalinux.org / access.redhat.com, plus Red Hat Security Advisories (access.redhat.com/security) for qemu-kvm/libvirt/kernel CVEs.
- Japanese SI canon: IPA (ipa.go.jp) 'モデル取引・契約書' (model transaction/contract documents) and 共通フレーム for 要件定義/検収 (verify exact page); 厚生労働省 (mhlw.go.jp) 労働者派遣事業と請負により行われる事業との区分に関する基準 (告示37号) and 偽装請負 guidance (verify exact page); and Kagoya Cloud VPS official plans/terms/規約 (kagoya.jp) for real plan<->price mapping and the customer-VM backup policy

---
