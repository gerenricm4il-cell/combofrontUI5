sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
  "use strict";

  function cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  return Controller.extend("promos.controller.Main", {
    onInit: function () {
      var oModel = this.getOwnerComponent().getModel();
      oModel.attachPropertyChange(this._onModelChange.bind(this));
    },

    _onModelChange: function () {
      var oModel = this.getOwnerComponent().getModel();
      oModel.refresh(true);
    },

    onAnexoChange: function (oEvent) {
      var sFile = oEvent.getParameter("newValue");
      var oModel = this.getOwnerComponent().getModel();
      oModel.setProperty("/combo/cab/anexo", sFile);
      if (sFile) {
        MessageToast.show("Arquivo selecionado: " + sFile);
      }
    },

    onReqImpChange: function (oEvent) {
      var sFile = oEvent.getParameter("newValue");
      var oModel = this.getOwnerComponent().getModel();
      oModel.setProperty("/combo/req/impStr", sFile);
      if (sFile) {
        MessageToast.show("Arquivo selecionado: " + sFile);
      }
    },

    onTpComboSel: function (oEvent) {
      var oModel = this.getOwnerComponent().getModel();
      var bSel = oEvent.getParameter("selected");
      var sTipo = oEvent.getSource().data("tipo");
      if (bSel) {
        oModel.setProperty("/combo/cab/tpHist", sTipo === "tpHist");
        oModel.setProperty("/combo/cab/tpPed", sTipo === "tpPed");
        oModel.setProperty("/combo/cab/tpNfe", sTipo === "tpNfe");
      }
    },

    onAplBenSel: function (oEvent) {
      var oModel = this.getOwnerComponent().getModel();
      var bSel = oEvent.getParameter("selected");
      var sTipo = oEvent.getSource().data("tipo");
      if (bSel) {
        oModel.setProperty("/combo/ben/aplNf", sTipo === "aplNf");
        oModel.setProperty("/combo/ben/aplBol", sTipo === "aplBol");
      }
    },

    onReqTipoChange: function (oEvent) {
      var oModel = this.getOwnerComponent().getModel();
      var sTipo = oEvent.getParameter("selectedItem").getKey();
      if (sTipo === "Combo") {
        oModel.setProperty("/combo/req/draft/qMax", null);
        oModel.setProperty("/combo/req/draft/vMax", null);
      }
    },

    onBenTipoChange: function (oEvent) {
      var oModel = this.getOwnerComponent().getModel();
      var sTipo = oEvent.getParameter("selectedItem").getKey();
      if (sTipo === "Prazo Extra") {
        oModel.setProperty("/combo/ben/mult", false);
        oModel.setProperty("/combo/ben/aplNf", false);
        oModel.setProperty("/combo/ben/aplBol", false);
        oModel.setProperty("/combo/ben/limVez", null);
      }
      if (sTipo === "Desconto Percentual" || sTipo === "Desconto Absoluto") {
        oModel.setProperty("/combo/ben/limVez", null);
      }
      if (sTipo !== "Desconto Percentual" && sTipo !== "Desconto Absoluto") {
        oModel.setProperty("/combo/ben/aplNf", false);
        oModel.setProperty("/combo/ben/aplBol", false);
      }
    },

    onBenMultChange: function () {
      var oModel = this.getOwnerComponent().getModel();
      oModel.refresh(true);
    },

    onLimVezChange: function (oEvent) {
      var oModel = this.getOwnerComponent().getModel();
      var sTipo = oModel.getProperty("/combo/ben/tipo");
      var sValue = oEvent.getParameter("value");
      if (sTipo === "Bonificação" && sValue) {
        oModel.setProperty("/combo/ben/limMax", null);
      }
    },

    onLimMaxChange: function (oEvent) {
      var oModel = this.getOwnerComponent().getModel();
      var sTipo = oModel.getProperty("/combo/ben/tipo");
      var sValue = oEvent.getParameter("value");
      if (sTipo === "Bonificação" && sValue) {
        oModel.setProperty("/combo/ben/limVez", null);
      }
    },

    onAddRow: function (oEvent) {
      var oModel = this.getOwnerComponent().getModel();
      var sPath = oEvent.getSource().getCustomData().find(function (d) { return d.getKey() === "path"; }).getValue();
      var a = oModel.getProperty(sPath) || [];
      a.push({});
      oModel.setProperty(sPath, a);
    },

    onDelRow: function (oEvent) {
      var oModel = this.getOwnerComponent().getModel();
      var sPath = oEvent.getSource().getBindingContext().getPath();
      var aPath = sPath.split("/");
      var iIdx = parseInt(aPath.pop(), 10);
      var sArrPath = aPath.join("/");
      var a = (oModel.getProperty(sArrPath) || []).slice(0);
      if (iIdx > -1 && iIdx < a.length) {
        a.splice(iIdx, 1);
        oModel.setProperty(sArrPath, a);
      }
    },

    onAddPermItem: function () {
      var oModel = this.getOwnerComponent().getModel();
      var a = oModel.getProperty("/combo/perm/itens") || [];
      a.push({ org: "", can: "", uf: "", cid: "", cen: "", reg: "", eqp: "", vend: "", grp: "", agr: "" });
      oModel.setProperty("/combo/perm/itens", a.slice(0));
      oModel.refresh(true);
    },

    onDelPermItem: function () {
      var oTable = this.byId("tblPerm");
      var aIdx = oTable.getSelectedIndices();
      if (!aIdx.length) {
        MessageToast.show("Selecione ao menos uma linha");
        return;
      }
      var oModel = this.getOwnerComponent().getModel();
      var a = (oModel.getProperty("/combo/perm/itens") || []).slice(0);
      for (var i = aIdx.length - 1; i >= 0; i--) {
        a.splice(aIdx[i], 1);
      }
      oModel.setProperty("/combo/perm/itens", a);
      oModel.refresh(true);
      oTable.clearSelection();
    },

    onAddExcItem: function () {
      var oModel = this.getOwnerComponent().getModel();
      var a = oModel.getProperty("/combo/perm/excs") || [];
      a.push({ vend: "", agr: "", cli: "" });
      oModel.setProperty("/combo/perm/excs", a.slice(0));
      oModel.refresh(true);
    },

    onDelExcItem: function () {
      var oTable = this.byId("tblExc");
      var aIdx = oTable.getSelectedIndices();
      if (!aIdx.length) {
        MessageToast.show("Selecione ao menos uma linha");
        return;
      }
      var oModel = this.getOwnerComponent().getModel();
      var a = (oModel.getProperty("/combo/perm/excs") || []).slice(0);
      for (var i = aIdx.length - 1; i >= 0; i--) {
        a.splice(aIdx[i], 1);
      }
      oModel.setProperty("/combo/perm/excs", a);
      oModel.refresh(true);
      oTable.clearSelection();
    },

    onAddReqEspec: function () {
      var oModel = this.getOwnerComponent().getModel();
      var oDraft = cloneDeep(oModel.getProperty("/combo/req/draft"));
      var a = oModel.getProperty("/combo/req/especs") || [];
      a.push(oDraft);
      oModel.setProperty("/combo/req/especs", a.slice(0));
      oModel.setProperty("/combo/req/draft", { tipo: "Material", desc: "", qMin: null, qMax: null, vMin: null, vMax: null });
      oModel.refresh(true);
    },

    onDelReqEspec: function () {
      var oTable = this.byId("tblReqEspec");
      var aIdx = oTable.getSelectedIndices();
      if (!aIdx.length) {
        MessageToast.show("Selecione ao menos uma linha");
        return;
      }
      var oModel = this.getOwnerComponent().getModel();
      var a = (oModel.getProperty("/combo/req/especs") || []).slice(0);
      for (var i = aIdx.length - 1; i >= 0; i--) {
        a.splice(aIdx[i], 1);
      }
      oModel.setProperty("/combo/req/especs", a);
      oModel.refresh(true);
      oTable.clearSelection();
    },

    onAddMatSel: function () {
      var oModel = this.getOwnerComponent().getModel();
      var a = oModel.getProperty("/combo/req/matSel") || [];
      a.push({ cod: "", mat: "" });
      oModel.setProperty("/combo/req/matSel", a.slice(0));
      oModel.refresh(true);
    },

    onDelMatSel: function () {
      var oTable = this.byId("tblMatSel");
      var aIdx = oTable.getSelectedIndices();
      if (!aIdx.length) {
        MessageToast.show("Selecione ao menos uma linha");
        return;
      }
      var oModel = this.getOwnerComponent().getModel();
      var a = (oModel.getProperty("/combo/req/matSel") || []).slice(0);
      for (var i = aIdx.length - 1; i >= 0; i--) {
        a.splice(aIdx[i], 1);
      }
      oModel.setProperty("/combo/req/matSel", a);
      oModel.refresh(true);
      oTable.clearSelection();
    },

    onAddBenItem: function () {
      var oModel = this.getOwnerComponent().getModel();
      var a = oModel.getProperty("/combo/ben/itens") || [];
      a.push({ cod: "", mat: "", desc: null });
      oModel.setProperty("/combo/ben/itens", a.slice(0));
      oModel.refresh(true);
    },

    onDelBenItem: function () {
      var oTable = this.byId("tblBenItens");
      var aIdx = oTable.getSelectedIndices();
      if (!aIdx.length) {
        MessageToast.show("Selecione ao menos uma linha");
        return;
      }
      var oModel = this.getOwnerComponent().getModel();
      var a = (oModel.getProperty("/combo/ben/itens") || []).slice(0);
      for (var i = aIdx.length - 1; i >= 0; i--) {
        a.splice(aIdx[i], 1);
      }
      oModel.setProperty("/combo/ben/itens", a);
      oModel.refresh(true);
      oTable.clearSelection();
    },

    onSave: function () {
      var oModel = this.getOwnerComponent().getModel();
      var oCombo = cloneDeep(oModel.getProperty("/combo"));
      var a = oModel.getProperty("/combos") || [];
      a.push(oCombo);
      oModel.setProperty("/combos", a);
      MessageToast.show("Combo salvo em memória");
    },

    onClear: function () {
      var oModel = this.getOwnerComponent().getModel();
      oModel.setProperty("/combo", {
        cab: {
          cod: "",
          desc: "",
          dtIni: null,
          dtFim: null,
          tpHist: false,
          tpPed: false,
          tpNfe: false,
          resum: "",
          anexo: "",
          expAfv: false,
          expEcom: false,
          expPont: false
        },
        perm: { itens: [], excs: [] },
        req: {
          gerais: { qtdMin: null, qtdMax: null, vlrMin: null, vlrMax: null, mix: "", casad: false },
          draft: { tipo: "Material", desc: "", qMin: null, qMax: null, vMin: null, vMax: null },
          especs: [],
          matSel: [],
          impStr: ""
        },
        ben: { tipo: "Unicoins", mult: false, aplNf: false, aplBol: false, limVez: null, limMax: null, tipoApl: "Por Material", itens: [] }
      });
      MessageBox.information("Formulário limpo");
    }
  });
});


