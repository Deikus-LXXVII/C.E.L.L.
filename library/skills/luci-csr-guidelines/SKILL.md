---
name: "luci-csr-guidelines"
description: "Modern Javascript (ES6+) rules and JSON-RPC (ubus) guidelines for LuCI Client-Side Rendering (no Lua templates)."
labels: ["skills", "luci", "javascript", "openwrt"]
danger_level: "Low"
danger_details: "Safe development guidelines."
---

# LuCI Client-Side Rendering (CSR) Guidelines

**Trigger**: Use this skill when asked to create, debug, or understand OpenWrt LuCI web interface pages, widgets, or apps.

## 1. Core Architecture
OpenWrt's LuCI no longer uses Lua for HTML generation. It uses Client-Side Rendering (CSR) powered by ES6+ JavaScript. The router acts as a headless data provider via `ubus` and `rpcd`, while the browser handles DOM rendering.

## 2. Rules for LuCI App Development
1. **No Lua UI**: Do not write `.htm` templates or `cbi` Lua models. 
2. **JS View Definition**: Create views in `htdocs/luci-static/resources/view/`. Extend `LuCI.view`.
3. **DOM Generation**: Use the global `E(tagName, attributes, children)` function to build DOM nodes dynamically.
4. **Forms API**: Use `LuCI.form` classes (`Map`, `TypedSection`, `Value`) for configuration UI that binds automatically to OpenWrt UCI.
5. **RPC Calls**: Use `LuCI.rpc.declare()` to wrap ubus calls into Promises.

## 3. Access Control (rpcd ACLs)
Before your JavaScript can invoke `ubus` or read `uci`, it MUST be granted permission.
1. Create a JSON ACL file in `/usr/share/rpcd/acl.d/my-app.json`.
2. Specify `read` and `write` access for `uci` and `ubus`.
3. Reload the daemon: `service rpcd reload`.

## 4. Implementation Example
```javascript
'use strict';
'require view';
'require rpc';

var getSysInfo = rpc.declare({
    object: 'system',
    method: 'info',
    expect: { '': {} }
});

return view.extend({
    load: function() {
        return getSysInfo();
    },
    render: function(sysInfo) {
        return E('div', { 'class': 'cbi-map' }, [
            E('h2', {}, 'System Info'),
            E('p', {}, 'Memory: ' + sysInfo.memory.total)
        ]);
    }
});
```
