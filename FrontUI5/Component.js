sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel"], function (UIComponent, JSONModel) {
  "use strict";
  return UIComponent.extend("promos.Component", {
    metadata: {
      manifest: "json"
    },
    init: function () {
      UIComponent.prototype.init.apply(this, arguments);
      var oData = {
        combo: {
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
          perm: {
            itens: [],
            excs: []
          },
          req: {
            gerais: {
              qtdMin: null,
              qtdMax: null,
              vlrMin: null,
              vlrMax: null,
              mix: "",
              casad: false
            },
            draft: {
              tipo: "Marca",
              desc: "",
              qMin: null,
              qMax: null,
              vMin: null,
              vMax: null
            },
            especs: [],
            matSel: [],
            impStr: ""
          },
          ben: {
            tipo: "Bonificação",
            mult: false,
            aplNf: false,
            aplBol: false,
            limVez: null,
            limMax: null,
            tipoApl: "Por Material",
            itens: []
          }
        },
        lists: {
          benTipos: [
            "Bonificação",
            "Desconto Percentual",
            "Desconto Absoluto",
            "Cashback Percentual",
            "Cashback Absoluto",
            "Unicoins",
            "Prazo Extra"
          ],
          benAplTipos: ["Por Material", "Por Agrup.Material", "Por Fornecedor"],
          reqTipos: ["Marca", "Linha", "Categoria", "Material", "Fornecedor"]
        },
        combos: []
      };
      var oModel = new JSONModel(oData);
      this.setModel(oModel);
    }
  });
});


