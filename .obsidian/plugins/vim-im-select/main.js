/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// main.ts
__export(exports, {
  default: () => VimImPlugin
});
var import_obsidian = __toModule(require("obsidian"));
var os = __toModule(require("os"));
var DEFAULT_SETTINGS = {
  defaultIM: "",
  obtainCmd: "",
  switchCmd: "",
  windowsDefaultIM: "",
  windowsObtainCmd: "",
  windowsSwitchCmd: ""
};
var VimImPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.currentInsertIM = "";
    this.previousMode = "";
    this.isWinPlatform = false;
    this.initialized = false;
    this.editorMode = null;
  }
  onload() {
    return __async(this, null, function* () {
      yield this.loadSettings();
      this.app.workspace.on("file-open", (_file) => __async(this, null, function* () {
        if (!this.initialized)
          yield this.initialize();
        let view = this.getActiveView();
        if (view) {
          var editor = this.getCodeMirror(view);
          if (editor) {
            if (!editor.state.vim.insertMode) {
              this.switchToNormal();
            }
            editor.on("vim-mode-change", (modeObj) => {
              if (modeObj) {
                this.onVimModeChanged(modeObj);
              }
            });
          }
        }
      }));
      this.addSettingTab(new SampleSettingTab(this.app, this));
      console.debug("VimIm::OS type: " + os.type());
      this.isWinPlatform = os.type() == "Windows_NT";
      this.currentInsertIM = this.isWinPlatform ? this.settings.windowsDefaultIM : this.settings.defaultIM;
      if (this.isWinPlatform) {
        console.debug("VimIm Use Windows config");
      }
    });
  }
  initialize() {
    return __async(this, null, function* () {
      if (this.initialized)
        return;
      if ("editor:toggle-source" in this.app.commands.editorCommands) {
        this.editorMode = "cm6";
        console.debug("Vimrc plugin: using CodeMirror 6 mode");
      } else {
        this.editorMode = "cm5";
        console.debug("Vimrc plugin: using CodeMirror 5 mode");
      }
      this.initialized = true;
    });
  }
  getActiveView() {
    return this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
  }
  getCodeMirror(view) {
    var _a, _b, _c, _d;
    if (this.editorMode == "cm6")
      return (_c = (_b = (_a = view.sourceMode) == null ? void 0 : _a.cmEditor) == null ? void 0 : _b.cm) == null ? void 0 : _c.cm;
    else
      return (_d = view.sourceMode) == null ? void 0 : _d.cmEditor;
  }
  switchToInsert() {
    const { exec } = require("child_process");
    let switchToInsert;
    if (this.currentInsertIM) {
      switchToInsert = this.isWinPlatform ? this.settings.windowsSwitchCmd.replace(/{im}/, this.currentInsertIM) : this.settings.switchCmd.replace(/{im}/, this.currentInsertIM);
    }
    console.debug("change to insert");
    if (typeof switchToInsert != "undefined" && switchToInsert) {
      exec(switchToInsert, (error, stdout, stderr) => {
        if (error) {
          console.error(`switch error: ${error}`);
          return;
        }
        console.debug(`switch im: ${switchToInsert}`);
      });
    }
    this.previousMode = "insert";
  }
  switchToNormal() {
    const { exec } = require("child_process");
    const switchFromInsert = this.isWinPlatform ? this.settings.windowsSwitchCmd.replace(/{im}/, this.settings.windowsDefaultIM) : this.settings.switchCmd.replace(/{im}/, this.settings.defaultIM);
    const obtainc = this.isWinPlatform ? this.settings.windowsObtainCmd : this.settings.obtainCmd;
    console.debug("change to noInsert");
    if (typeof obtainc != "undefined" && obtainc) {
      exec(obtainc, (error, stdout, stderr) => {
        if (error) {
          console.error(`obtain error: ${error}`);
          return;
        }
        this.currentInsertIM = stdout;
        console.debug(`obtain im: ${this.currentInsertIM}`);
      });
    }
    if (typeof switchFromInsert != "undefined" && switchFromInsert) {
      exec(switchFromInsert, (error, stdout, stderr) => {
        if (error) {
          console.error(`switch error: ${error}`);
          return;
        }
        console.debug(`switch im: ${switchFromInsert}`);
      });
    }
    this.previousMode = "normal";
  }
  onVimModeChanged(modeObj) {
    switch (modeObj.mode) {
      case "insert":
        this.switchToInsert();
        break;
      default:
        if (this.previousMode != "insert") {
          break;
        }
        this.switchToNormal();
        break;
    }
  }
  onunload() {
    console.debug("onunload");
  }
  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
};
var SampleSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Vim IM Select Settings." });
    containerEl.createEl("h3", { text: "Settings for default platform." });
    new import_obsidian.Setting(containerEl).setName("Default IM").setDesc("IM for normal mode").addText((text) => text.setPlaceholder("Default IM").setValue(this.plugin.settings.defaultIM).onChange((value) => __async(this, null, function* () {
      console.debug("Default IM: " + value);
      this.plugin.settings.defaultIM = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Obtaining Command").setDesc("Command for obtaining current IM(must be excutable)").addText((text) => text.setPlaceholder("Obtaining Command").setValue(this.plugin.settings.obtainCmd).onChange((value) => __async(this, null, function* () {
      console.debug("Obtain Cmd: " + value);
      this.plugin.settings.obtainCmd = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Switching Command").setDesc("Command for switching to specific IM(must be excutable)").addText((text) => text.setPlaceholder("Use {im} as placeholder of IM").setValue(this.plugin.settings.switchCmd).onChange((value) => __async(this, null, function* () {
      console.debug("Switch Cmd: " + value);
      this.plugin.settings.switchCmd = value;
      yield this.plugin.saveSettings();
    })));
    containerEl.createEl("h3", { text: "Settings for Windows platform." });
    new import_obsidian.Setting(containerEl).setName("Windows Default IM").setDesc("IM for normal mode").addText((text) => text.setPlaceholder("Default IM").setValue(this.plugin.settings.windowsDefaultIM).onChange((value) => __async(this, null, function* () {
      console.debug("Default IM: " + value);
      this.plugin.settings.windowsDefaultIM = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Obtaining Command on Windows").setDesc("Command for obtaining current IM(must be excutable)").addText((text) => text.setPlaceholder("Obtaining Command").setValue(this.plugin.settings.windowsObtainCmd).onChange((value) => __async(this, null, function* () {
      console.debug("Obtain Cmd: " + value);
      this.plugin.settings.windowsObtainCmd = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("Switching Command on Windows").setDesc("Command for switching to specific IM(must be excutable)").addText((text) => text.setPlaceholder("Use {im} as placeholder of IM").setValue(this.plugin.settings.windowsSwitchCmd).onChange((value) => __async(this, null, function* () {
      console.debug("Switch Cmd: " + value);
      this.plugin.settings.windowsSwitchCmd = value;
      yield this.plugin.saveSettings();
    })));
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLypcclxuTUlUIExpY2Vuc2VcclxuXHJcbkNvcHlyaWdodCAoYykgWzIwMjFdIFtBbG9uZWx1ciB5aW53ZW5oYW4xOTk4QGdtYWlsLmNvbV1cclxuXHJcblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXHJcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcclxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcblxyXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcclxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXHJcblNPRlRXQVJFLlxyXG4qL1xyXG5pbXBvcnQgeyBBcHAsIFBsdWdpbiwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZywgTWFya2Rvd25WaWV3IH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5cclxuaW1wb3J0ICogYXMgb3MgZnJvbSAnb3MnO1xyXG5pbnRlcmZhY2UgVmltSW1QbHVnaW5TZXR0aW5ncyB7XHJcblx0ZGVmYXVsdElNOiBzdHJpbmc7XHJcblx0b2J0YWluQ21kOiBzdHJpbmc7XHJcblx0c3dpdGNoQ21kOiBzdHJpbmc7XHJcblx0d2luZG93c0RlZmF1bHRJTTogc3RyaW5nO1xyXG5cdHdpbmRvd3NPYnRhaW5DbWQ6IHN0cmluZztcclxuXHR3aW5kb3dzU3dpdGNoQ21kOiBzdHJpbmc7XHJcbn1cclxuXHJcbmNvbnN0IERFRkFVTFRfU0VUVElOR1M6IFZpbUltUGx1Z2luU2V0dGluZ3MgPSB7XHJcblx0ZGVmYXVsdElNOiAnJyxcclxuXHRvYnRhaW5DbWQ6ICcnLFxyXG5cdHN3aXRjaENtZDogJycsXHJcblx0d2luZG93c0RlZmF1bHRJTTogJycsXHJcblx0d2luZG93c09idGFpbkNtZDogJycsXHJcblx0d2luZG93c1N3aXRjaENtZDogJycsXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmltSW1QbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xyXG5cdHNldHRpbmdzOiBWaW1JbVBsdWdpblNldHRpbmdzO1xyXG5cdHByaXZhdGUgY3VycmVudEluc2VydElNID0gJyc7XHJcblx0cHJpdmF0ZSBwcmV2aW91c01vZGUgPSAnJztcclxuXHRwcml2YXRlIGlzV2luUGxhdGZvcm0gPSBmYWxzZTtcclxuXHJcblx0cHJpdmF0ZSBpbml0aWFsaXplZCA9IGZhbHNlO1xyXG5cdHByaXZhdGUgZWRpdG9yTW9kZTogJ2NtNScgfCAnY202JyA9IG51bGw7XHJcblxyXG5cdGFzeW5jIG9ubG9hZCgpIHtcclxuXHRcdGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XHJcblxyXG5cdFx0Ly8gd2hlbiBvcGVuIGEgZmlsZSwgdG8gaW5pdGlhbGl6ZSBjdXJyZW50XHJcblx0XHQvLyBlZGl0b3IgdHlwZSBDb2RlTWlycm9yNSBvciBDb2RlTWlycm9yNlxyXG5cdFx0dGhpcy5hcHAud29ya3NwYWNlLm9uKCdmaWxlLW9wZW4nLCBhc3luYyAoX2ZpbGUpID0+IHtcclxuXHRcdFx0aWYgKCF0aGlzLmluaXRpYWxpemVkKVxyXG5cdFx0XHRcdGF3YWl0IHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cclxuXHRcdFx0bGV0IHZpZXcgPSB0aGlzLmdldEFjdGl2ZVZpZXcoKTtcclxuXHRcdFx0aWYgKHZpZXcpIHtcclxuXHRcdFx0XHR2YXIgZWRpdG9yID0gdGhpcy5nZXRDb2RlTWlycm9yKHZpZXcpO1xyXG5cclxuXHRcdFx0XHRpZiAoZWRpdG9yKSB7XHJcblx0XHRcdFx0XHQvLyBjaGVjayBpZiBub3QgaW4gaW5zZXJ0IG1vZGUobm9ybWFsIG9yIHZpc3VhbCBtb2RlKSwgc3dpdGggdG8gbm9ybWFsIGF0IGZpcnN0XHJcblx0XHRcdFx0XHRpZiAoIWVkaXRvci5zdGF0ZS52aW0uaW5zZXJ0TW9kZSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLnN3aXRjaFRvTm9ybWFsKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlZGl0b3Iub24oJ3ZpbS1tb2RlLWNoYW5nZScsIChtb2RlT2JqOiBhbnkpID0+IHtcclxuXHRcdFx0XHRcdFx0aWYgKG1vZGVPYmopIHtcclxuXHRcdFx0XHRcdFx0XHQvLyB3aGVuIGVkaXRvciBpcyByZWFkeSwgc2V0IGRlZmF1bHQgbW9kZSB0byBub3JtYWxcclxuXHRcdFx0XHRcdFx0XHR0aGlzLm9uVmltTW9kZUNoYW5nZWQobW9kZU9iaik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cclxuXHRcdC8vIFRoaXMgYWRkcyBhIHNldHRpbmdzIHRhYiBzbyB0aGUgdXNlciBjYW4gY29uZmlndXJlIHZhcmlvdXMgYXNwZWN0cyBvZiB0aGUgcGx1Z2luXHJcblx0XHR0aGlzLmFkZFNldHRpbmdUYWIobmV3IFNhbXBsZVNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcclxuXHJcblx0XHRjb25zb2xlLmRlYnVnKFwiVmltSW06Ok9TIHR5cGU6IFwiICsgb3MudHlwZSgpKTtcclxuXHRcdHRoaXMuaXNXaW5QbGF0Zm9ybSA9IG9zLnR5cGUoKSA9PSAnV2luZG93c19OVCc7XHJcblxyXG5cdFx0dGhpcy5jdXJyZW50SW5zZXJ0SU0gPSB0aGlzLmlzV2luUGxhdGZvcm0gPyB0aGlzLnNldHRpbmdzLndpbmRvd3NEZWZhdWx0SU0gOiB0aGlzLnNldHRpbmdzLmRlZmF1bHRJTTtcclxuXHJcblx0XHRpZiAodGhpcy5pc1dpblBsYXRmb3JtKSB7XHJcblx0XHRcdGNvbnNvbGUuZGVidWcoXCJWaW1JbSBVc2UgV2luZG93cyBjb25maWdcIik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhc3luYyBpbml0aWFsaXplKCkge1xyXG5cdFx0aWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHQvLyBEZXRlcm1pbmUgaWYgd2UgaGF2ZSB0aGUgbGVnYWN5IE9ic2lkaWFuIGVkaXRvciAoQ001KSBvciB0aGUgbmV3IG9uZSAoQ002KS5cclxuXHRcdC8vIFRoaXMgaXMgb25seSBhdmFpbGFibGUgYWZ0ZXIgT2JzaWRpYW4gaXMgZnVsbHkgbG9hZGVkLCBzbyB3ZSBkbyBpdCBhcyBwYXJ0IG9mIHRoZSBgZmlsZS1vcGVuYCBldmVudC5cclxuXHRcdGlmICgnZWRpdG9yOnRvZ2dsZS1zb3VyY2UnIGluICh0aGlzLmFwcCBhcyBhbnkpLmNvbW1hbmRzLmVkaXRvckNvbW1hbmRzKSB7XHJcblx0XHRcdHRoaXMuZWRpdG9yTW9kZSA9ICdjbTYnO1xyXG5cdFx0XHRjb25zb2xlLmRlYnVnKCdWaW1yYyBwbHVnaW46IHVzaW5nIENvZGVNaXJyb3IgNiBtb2RlJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmVkaXRvck1vZGUgPSAnY201JztcclxuXHRcdFx0Y29uc29sZS5kZWJ1ZygnVmltcmMgcGx1Z2luOiB1c2luZyBDb2RlTWlycm9yIDUgbW9kZScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXRBY3RpdmVWaWV3KCk6IE1hcmtkb3duVmlldyB7XHJcblx0XHRyZXR1cm4gdGhpcy5hcHAud29ya3NwYWNlLmdldEFjdGl2ZVZpZXdPZlR5cGUoTWFya2Rvd25WaWV3KTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZ2V0Q29kZU1pcnJvcih2aWV3OiBNYXJrZG93blZpZXcpOiBDb2RlTWlycm9yLkVkaXRvciB7XHJcblx0XHQvLyBGb3IgQ002IHRoaXMgYWN0dWFsbHkgcmV0dXJucyBhbiBpbnN0YW5jZSBvZiB0aGUgb2JqZWN0IG5hbWVkIENvZGVNaXJyb3IgZnJvbSBjbV9hZGFwdGVyIG9mIGNvZGVtaXJyb3JfdmltXHJcblx0XHRpZiAodGhpcy5lZGl0b3JNb2RlID09ICdjbTYnKVxyXG5cdFx0XHRyZXR1cm4gKHZpZXcgYXMgYW55KS5zb3VyY2VNb2RlPy5jbUVkaXRvcj8uY20/LmNtO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gKHZpZXcgYXMgYW55KS5zb3VyY2VNb2RlPy5jbUVkaXRvcjtcclxuXHR9XHJcblxyXG5cdHN3aXRjaFRvSW5zZXJ0KCkge1xyXG5cdFx0Y29uc3QgeyBleGVjIH0gPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XHJcblx0XHRsZXQgc3dpdGNoVG9JbnNlcnQ6IHN0cmluZztcclxuXHRcdGlmICh0aGlzLmN1cnJlbnRJbnNlcnRJTSkge1xyXG5cdFx0XHRzd2l0Y2hUb0luc2VydCA9IHRoaXMuaXNXaW5QbGF0Zm9ybSA/XHJcblx0XHRcdFx0dGhpcy5zZXR0aW5ncy53aW5kb3dzU3dpdGNoQ21kLnJlcGxhY2UoL3tpbX0vLCB0aGlzLmN1cnJlbnRJbnNlcnRJTSkgOlxyXG5cdFx0XHRcdHRoaXMuc2V0dGluZ3Muc3dpdGNoQ21kLnJlcGxhY2UoL3tpbX0vLCB0aGlzLmN1cnJlbnRJbnNlcnRJTSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc29sZS5kZWJ1ZyhcImNoYW5nZSB0byBpbnNlcnRcIik7XHJcblx0XHRpZiAodHlwZW9mIHN3aXRjaFRvSW5zZXJ0ICE9ICd1bmRlZmluZWQnICYmIHN3aXRjaFRvSW5zZXJ0KSB7XHJcblx0XHRcdGV4ZWMoc3dpdGNoVG9JbnNlcnQsIChlcnJvcjogYW55LCBzdGRvdXQ6IGFueSwgc3RkZXJyOiBhbnkpID0+IHtcclxuXHRcdFx0XHRpZiAoZXJyb3IpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYHN3aXRjaCBlcnJvcjogJHtlcnJvcn1gKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y29uc29sZS5kZWJ1Zyhgc3dpdGNoIGltOiAke3N3aXRjaFRvSW5zZXJ0fWApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnByZXZpb3VzTW9kZSA9IFwiaW5zZXJ0XCJcclxuXHR9XHJcblxyXG5cdHN3aXRjaFRvTm9ybWFsKCkge1xyXG5cdFx0Y29uc3QgeyBleGVjIH0gPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XHJcblx0XHRjb25zdCBzd2l0Y2hGcm9tSW5zZXJ0ID0gdGhpcy5pc1dpblBsYXRmb3JtID9cclxuXHRcdFx0dGhpcy5zZXR0aW5ncy53aW5kb3dzU3dpdGNoQ21kLnJlcGxhY2UoL3tpbX0vLCB0aGlzLnNldHRpbmdzLndpbmRvd3NEZWZhdWx0SU0pIDpcclxuXHRcdFx0dGhpcy5zZXR0aW5ncy5zd2l0Y2hDbWQucmVwbGFjZSgve2ltfS8sIHRoaXMuc2V0dGluZ3MuZGVmYXVsdElNKTtcclxuXHRcdGNvbnN0IG9idGFpbmMgPSB0aGlzLmlzV2luUGxhdGZvcm0gP1xyXG5cdFx0XHR0aGlzLnNldHRpbmdzLndpbmRvd3NPYnRhaW5DbWQgOiB0aGlzLnNldHRpbmdzLm9idGFpbkNtZDtcclxuXHRcdGNvbnNvbGUuZGVidWcoXCJjaGFuZ2UgdG8gbm9JbnNlcnRcIik7XHJcblx0XHQvL1swXTogT2J0aWFuIGltIGluIEluc2VydCBNb2RlXHJcblx0XHRpZiAodHlwZW9mIG9idGFpbmMgIT0gJ3VuZGVmaW5lZCcgJiYgb2J0YWluYykge1xyXG5cdFx0XHRleGVjKG9idGFpbmMsIChlcnJvcjogYW55LCBzdGRvdXQ6IGFueSwgc3RkZXJyOiBhbnkpID0+IHtcclxuXHRcdFx0XHRpZiAoZXJyb3IpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoYG9idGFpbiBlcnJvcjogJHtlcnJvcn1gKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5jdXJyZW50SW5zZXJ0SU0gPSBzdGRvdXQ7XHJcblx0XHRcdFx0Y29uc29sZS5kZWJ1Zyhgb2J0YWluIGltOiAke3RoaXMuY3VycmVudEluc2VydElNfWApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdC8vWzFdOiBTd2l0Y2ggdG8gZGVmYXVsdCBpbVxyXG5cdFx0aWYgKHR5cGVvZiBzd2l0Y2hGcm9tSW5zZXJ0ICE9ICd1bmRlZmluZWQnICYmIHN3aXRjaEZyb21JbnNlcnQpIHtcclxuXHRcdFx0ZXhlYyhzd2l0Y2hGcm9tSW5zZXJ0LCAoZXJyb3I6IGFueSwgc3Rkb3V0OiBhbnksIHN0ZGVycjogYW55KSA9PiB7XHJcblx0XHRcdFx0aWYgKGVycm9yKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGBzd2l0Y2ggZXJyb3I6ICR7ZXJyb3J9YCk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNvbnNvbGUuZGVidWcoYHN3aXRjaCBpbTogJHtzd2l0Y2hGcm9tSW5zZXJ0fWApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnByZXZpb3VzTW9kZSA9IFwibm9ybWFsXCJcclxuXHR9XHJcblxyXG5cdG9uVmltTW9kZUNoYW5nZWQobW9kZU9iajogYW55KSB7XHJcblx0XHRzd2l0Y2ggKG1vZGVPYmoubW9kZSkge1xyXG5cdFx0XHRjYXNlIFwiaW5zZXJ0XCI6XHJcblx0XHRcdFx0dGhpcy5zd2l0Y2hUb0luc2VydCgpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdGlmICh0aGlzLnByZXZpb3VzTW9kZSAhPSBcImluc2VydFwiKSB7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5zd2l0Y2hUb05vcm1hbCgpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0b251bmxvYWQoKSB7XHJcblx0XHRjb25zb2xlLmRlYnVnKFwib251bmxvYWRcIik7XHJcblx0fVxyXG5cclxuXHRhc3luYyBsb2FkU2V0dGluZ3MoKSB7XHJcblx0XHR0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgYXdhaXQgdGhpcy5sb2FkRGF0YSgpKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcclxuXHRcdGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XHJcblx0fVxyXG5cclxufVxyXG5cclxuY2xhc3MgU2FtcGxlU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xyXG5cdHBsdWdpbjogVmltSW1QbHVnaW47XHJcblxyXG5cdGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IFZpbUltUGx1Z2luKSB7XHJcblx0XHRzdXBlcihhcHAsIHBsdWdpbik7XHJcblx0XHR0aGlzLnBsdWdpbiA9IHBsdWdpbjtcclxuXHR9XHJcblxyXG5cdGRpc3BsYXkoKTogdm9pZCB7XHJcblx0XHRjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xyXG5cclxuXHRcdGNvbnRhaW5lckVsLmVtcHR5KCk7XHJcblxyXG5cdFx0Y29udGFpbmVyRWwuY3JlYXRlRWwoJ2gyJywgeyB0ZXh0OiAnVmltIElNIFNlbGVjdCBTZXR0aW5ncy4nIH0pO1xyXG5cclxuXHRcdGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMycsIHsgdGV4dDogJ1NldHRpbmdzIGZvciBkZWZhdWx0IHBsYXRmb3JtLicgfSk7XHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ0RlZmF1bHQgSU0nKVxyXG5cdFx0XHQuc2V0RGVzYygnSU0gZm9yIG5vcm1hbCBtb2RlJylcclxuXHRcdFx0LmFkZFRleHQodGV4dCA9PiB0ZXh0XHJcblx0XHRcdFx0LnNldFBsYWNlaG9sZGVyKCdEZWZhdWx0IElNJylcclxuXHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZGVmYXVsdElNKVxyXG5cdFx0XHRcdC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZGVidWcoJ0RlZmF1bHQgSU06ICcgKyB2YWx1ZSk7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZWZhdWx0SU0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG5cdFx0XHRcdH0pKTtcclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnT2J0YWluaW5nIENvbW1hbmQnKVxyXG5cdFx0XHQuc2V0RGVzYygnQ29tbWFuZCBmb3Igb2J0YWluaW5nIGN1cnJlbnQgSU0obXVzdCBiZSBleGN1dGFibGUpJylcclxuXHRcdFx0LmFkZFRleHQodGV4dCA9PiB0ZXh0XHJcblx0XHRcdFx0LnNldFBsYWNlaG9sZGVyKCdPYnRhaW5pbmcgQ29tbWFuZCcpXHJcblx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm9idGFpbkNtZClcclxuXHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmRlYnVnKCdPYnRhaW4gQ21kOiAnICsgdmFsdWUpO1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3Mub2J0YWluQ21kID0gdmFsdWU7XHJcblx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHR9KSk7XHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ1N3aXRjaGluZyBDb21tYW5kJylcclxuXHRcdFx0LnNldERlc2MoJ0NvbW1hbmQgZm9yIHN3aXRjaGluZyB0byBzcGVjaWZpYyBJTShtdXN0IGJlIGV4Y3V0YWJsZSknKVxyXG5cdFx0XHQuYWRkVGV4dCh0ZXh0ID0+IHRleHRcclxuXHRcdFx0XHQuc2V0UGxhY2Vob2xkZXIoJ1VzZSB7aW19IGFzIHBsYWNlaG9sZGVyIG9mIElNJylcclxuXHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc3dpdGNoQ21kKVxyXG5cdFx0XHRcdC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZGVidWcoJ1N3aXRjaCBDbWQ6ICcgKyB2YWx1ZSk7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5zd2l0Y2hDbWQgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG5cdFx0XHRcdH0pKTtcclxuXHJcblx0XHRjb250YWluZXJFbC5jcmVhdGVFbCgnaDMnLCB7IHRleHQ6ICdTZXR0aW5ncyBmb3IgV2luZG93cyBwbGF0Zm9ybS4nIH0pO1xyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcblx0XHRcdC5zZXROYW1lKCdXaW5kb3dzIERlZmF1bHQgSU0nKVxyXG5cdFx0XHQuc2V0RGVzYygnSU0gZm9yIG5vcm1hbCBtb2RlJylcclxuXHRcdFx0LmFkZFRleHQodGV4dCA9PiB0ZXh0XHJcblx0XHRcdFx0LnNldFBsYWNlaG9sZGVyKCdEZWZhdWx0IElNJylcclxuXHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Mud2luZG93c0RlZmF1bHRJTSlcclxuXHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmRlYnVnKCdEZWZhdWx0IElNOiAnICsgdmFsdWUpO1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3Mud2luZG93c0RlZmF1bHRJTSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0fSkpO1xyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcblx0XHRcdC5zZXROYW1lKCdPYnRhaW5pbmcgQ29tbWFuZCBvbiBXaW5kb3dzJylcclxuXHRcdFx0LnNldERlc2MoJ0NvbW1hbmQgZm9yIG9idGFpbmluZyBjdXJyZW50IElNKG11c3QgYmUgZXhjdXRhYmxlKScpXHJcblx0XHRcdC5hZGRUZXh0KHRleHQgPT4gdGV4dFxyXG5cdFx0XHRcdC5zZXRQbGFjZWhvbGRlcignT2J0YWluaW5nIENvbW1hbmQnKVxyXG5cdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy53aW5kb3dzT2J0YWluQ21kKVxyXG5cdFx0XHRcdC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZGVidWcoJ09idGFpbiBDbWQ6ICcgKyB2YWx1ZSk7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy53aW5kb3dzT2J0YWluQ21kID0gdmFsdWU7XHJcblx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHR9KSk7XHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ1N3aXRjaGluZyBDb21tYW5kIG9uIFdpbmRvd3MnKVxyXG5cdFx0XHQuc2V0RGVzYygnQ29tbWFuZCBmb3Igc3dpdGNoaW5nIHRvIHNwZWNpZmljIElNKG11c3QgYmUgZXhjdXRhYmxlKScpXHJcblx0XHRcdC5hZGRUZXh0KHRleHQgPT4gdGV4dFxyXG5cdFx0XHRcdC5zZXRQbGFjZWhvbGRlcignVXNlIHtpbX0gYXMgcGxhY2Vob2xkZXIgb2YgSU0nKVxyXG5cdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy53aW5kb3dzU3dpdGNoQ21kKVxyXG5cdFx0XHRcdC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcclxuXHRcdFx0XHRcdGNvbnNvbGUuZGVidWcoJ1N3aXRjaCBDbWQ6ICcgKyB2YWx1ZSk7XHJcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy53aW5kb3dzU3dpdGNoQ21kID0gdmFsdWU7XHJcblx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHR9KSk7XHJcblx0fVxyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBdUJBLHNCQUFxRTtBQUVyRSxTQUFvQjtB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VTtBQUMxQixjQUFRLE1BQU0saUJBQWlCO0FBQy9CLFdBQUssT0FBTyxTQUFTLFlBQVk7QUFDakMsWUFBTSxLQUFLLE9BQU87QUFBQTtBQUVyQixRQUFJLHdCQUFRLGFBQ1YsUUFBUSxxQkFDUixRQUFRLHVEQUNSLFFBQVEsVUFBUSxLQUNmLGVBQWUscUJBQ2YsU0FBUyxLQUFLLE9BQU8sU0FBUyxXQUM5QixTQUFTLENBQU8sVUFBVTtBQUMxQixjQUFRLE1BQU0saUJBQWlCO0FBQy9CLFdBQUssT0FBTyxTQUFTLFlBQVk7QUFDakMsWUFBTSxLQUFLLE9BQU87QUFBQTtBQUVyQixRQUFJLHdCQUFRLGFBQ1YsUUFBUSxxQkFDUixRQUFRLDJEQUNSLFFBQVEsVUFBUSxLQUNmLGVBQWUsaUNBQ2YsU0FBUyxLQUFLLE9BQU8sU0FBUyxXQUM5QixTQUFTLENBQU8sVUFBVTtBQUMxQixjQUFRLE1BQU0saUJBQWlCO0FBQy9CLFdBQUssT0FBTyxTQUFTLFlBQVk7QUFDakMsWUFBTSxLQUFLLE9BQU87QUFBQTtBQUdyQixnQkFBWSxTQUFTLE1BQU0sRUFBRSxNQUFNO0FBQ25DLFFBQUksd0JBQVEsYUFDVixRQUFRLHNCQUNSLFFBQVEsc0JBQ1IsUUFBUSxVQUFRLEtBQ2YsZUFBZSxjQUNmLFNBQVMsS0FBSyxPQUFPLFNBQVMsa0JBQzlCLFNBQVMsQ0FBTyxVQUFVO0FBQzFCLGNBQVEsTUFBTSxpQkFBaUI7QUFDL0IsV0FBSyxPQUFPLFNBQVMsbUJBQW1CO0FBQ3hDLFlBQU0sS0FBSyxPQUFPO0FBQUE7QUFFckIsUUFBSSx3QkFBUSxhQUNWLFFBQVEsZ0NBQ1IsUUFBUSx1REFDUixRQUFRLFVBQVEsS0FDZixlQUFlLHFCQUNmLFNBQVMsS0FBSyxPQUFPLFNBQVMsa0JBQzlCLFNBQVMsQ0FBTyxVQUFVO0FBQzFCLGNBQVEsTUFBTSxpQkFBaUI7QUFDL0IsV0FBSyxPQUFPLFNBQVMsbUJBQW1CO0FBQ3hDLFlBQU0sS0FBSyxPQUFPO0FBQUE7QUFFckIsUUFBSSx3QkFBUSxhQUNWLFFBQVEsZ0NBQ1IsUUFBUSwyREFDUixRQUFRLFVBQVEsS0FDZixlQUFlLGlDQUNmLFNBQVMsS0FBSyxPQUFPLFNBQVMsa0JBQzlCLFNBQVMsQ0FBTyxVQUFVO0FBQzFCLGNBQVEsTUFBTSxpQkFBaUI7QUFDL0IsV0FBSyxPQUFPLFNBQVMsbUJBQW1CO0FBQ3hDLFlBQU0sS0FBSyxPQUFPO0FBQUE7QUFBQTtBQUFBOyIsCiAgIm5hbWVzIjogW10KfQo=