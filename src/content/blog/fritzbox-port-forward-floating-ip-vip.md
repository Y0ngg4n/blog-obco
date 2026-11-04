---
title: "FritzBox! port forward floating IP (VIP)"
description: "So you have a floating IP via keepalived or kubevip for example and you want to\\nport forward it through your FritzBox! ?\\n\\nThey usual way would be to go to In"
translationKey: "fritzbox-port-forward-floating-ip-vip"
language: "en-US"
date: 2023-01-10
---

So you have a floating IP via keepalived or kubevip for example and you want to port forward it through your FritzBox! ?

They usual way would be to go to Internet -> Permit access -> Port Forwarding (de: Internet -> Freigaben -> Portfreigaben)

And usually you just would press \\"Add device for sharing\\" (de: Gerät für Freigabe hinzufügen) and select your device from the dropdown menu.

But that does not work with floating IPs because the MAC adress gets also bound to that Port forward and with a floating IP your MAC changes.

So what to do now?

So the first thing you have to do that sounds really weird but it only works this way. Take the devices offline and delete the floating ip from devices list in the FritzBox!. If you do not do that you will get an error with \\"IP Address already in use\\". So disable your keepalived or shutdown the devices and check that the IP is not registered in the FritzBox!.

Then go to Port Forwarding again and add a new Port Forward.

Now in the Dropdown Menu where you usually add devices via MAC you scroll down to the bottom. There it says something like \\"Entering IP manually\\". Select this option and enter your floating IP.

Add the ports you want to forward and press save.

If it gives you a error just repeat the process and try it again. Sometimes it does not work.

Congrats, now you have a floating IP port forward.

If you are using a pfSense with CARP:

Don´t forget to make your Port Forwards to the CARP IP and if you are using OpenVPN change the Interface in the OpenVPN Server to the CARP IP
