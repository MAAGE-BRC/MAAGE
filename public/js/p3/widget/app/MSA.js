define([
  'dojo/_base/declare', 'dijit/_WidgetBase', 'dojo/on',
  'dojo/dom-class',
  'dojo/text!./templates/MSA.html', './AppBase', 'dojo/dom-construct', 'dijit/registry',
  'dojo/_base/Deferred', 'dojo/aspect', 'dojo/_base/lang', 'dojo/domReady!', 'dijit/form/NumberTextBox', 'dijit/form/Textarea',
  'dojo/query', 'dojo/dom', 'dijit/popup', 'dijit/Tooltip', 'dijit/Dialog', 'dijit/TooltipDialog',
  'dojo/NodeList-traverse', '../../WorkspaceManager', 'dojo/store/Memory', 'dojox/widget/Standby', 'dojo/when'
], function (
  declare, WidgetBase, on,
  domClass,
  Template, AppBase, domConstruct, registry,
  Deferred, aspect, lang, domReady, NumberTextBox, Textarea,
  query, dom, popup, Tooltip, Dialog, TooltipDialog,
  children, WorkspaceManager, Memory, Standby, when
) {
  return declare([AppBase], {
    baseClass: 'App Assembly',
    templateString: Template,
    applicationName: 'MSA',
    requireAuth: true,
    applicationLabel: 'Multiple Sequence Alignment and SNP/Variation Analysis',
    applicationDescription: 'The multiple sequence alignment service with variation and SNP analysis can be used with feature groups, fasta files, aligned fasta files, and user input fasta records. If a single alignment file is given, then only the variation analysis is run.',
    applicationHelp: 'quick_references/services/msa_snp_variation_service.html',
    tutorialLink: 'tutorial/msa_snp_variation/msa_snp_variation.html',
    videoLink: '',
    pageTitle: 'Multiple Sequence Alignment and SNP/Variation Analysis',
    appBaseURL: 'MSA',
    defaultPath: '',
    startingRows: 14,
    // maxGenomes: 256,
    validFasta: false,
    textInput: false,

    // constructor: function () {
    //   this._selfSet = true;
    //   this.addedGenomes = 0;
    //   this.genomeToAttachPt = ['comp_genome_id'];
    //   this.fastaToAttachPt = ['user_genomes_fasta'];
    //   this.featureGroupToAttachPt = ['user_genomes_featuregroup'];
    //   this.genomeGroupToAttachPt = ['user_genomes_genomegroup'];
    //   this.alignmentToAttachPt = ['user_genomes_alignment'];
    //   this.userGenomeList = [];
    // },

    startup: function () {
      var _self = this;
      if (this._started) {
        return;
      }
      if (this.requireAuth && (window.App.authorizationToken === null || window.App.authorizationToken === undefined)) {
        return;
      }
      this.inherited(arguments);

      _self.defaultPath = WorkspaceManager.getDefaultFolder() || _self.activeWorkspacePath;
      _self.output_path.set('value', _self.defaultPath);
      // this.aligner.set('disabled', true);
      // this.emptyTable(this.genomeTable, this.startingRows);
      // this.numgenomes.startup();
      //      this.advrow.turnedOn = (this.advrow.style.display != 'none');
      //      on(this.advanced, 'click', lang.hitch(this, function () {
      //        this.advrow.turnedOn = (this.advrow.style.display != 'none');
      //        if (!this.advrow.turnedOn) {
      //          this.advrow.turnedOn = true;
      //          this.advrow.style.display = 'block';
      //          this.advicon.className = 'fa icon-caret-left fa-1';
      //        }
      //        else {
      //          this.advrow.turnedOn = false;
      //          this.advrow.style.display = 'none';
      //          this.advicon.className = 'fa icon-caret-down fa-1';
      //        }
      //      }));
      this._started = true;
      this.form_flag = false;
      try {
        this.intakeRerunForm();
      } catch (error) {
        console.error(error);
        var localStorage = window.localStorage;
        if (localStorage.hasOwnProperty("bvbrc_rerun_job")) {
          localStorage.removeItem("bvbrc_rerun_job");
        }
      }
    },

    // emptyTable: function (target, rowLimit) {
    //   for (var i = 0; i < rowLimit; i++) {
    //     var tr = target.insertRow(0);
    //     domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, tr);
    //     domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, tr);
    //     domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, tr);
    //   }
    // },

    // checkDuplicate: function (cur_value, attachType) {
    //   var success = 1;
    //   var genomeIds = [];
    //   var genomeList = query('.genomedata');
    //   genomeList.forEach(function (item) {
    //     genomeIds.push(item.genomeRecord[attachType]);
    //   });
    //   if (genomeIds.length > 0 && genomeIds.indexOf(cur_value) > -1) { // found duplicate
    //     success = 0;
    //   }
    //   return success;
    // },

    // ingestAttachPoints: function (input_pts, target, req) {
    //   req = typeof req !== 'undefined' ? req : true;
    //   var success = 1;
    //   input_pts.forEach(function (attachname) {
    //     var cur_value = null;
    //     var incomplete = 0;
    //     var browser_select = 0;
    //     if (attachname == 'output_path' || attachname == 'ref_user_genomes_fasta' || attachname == 'ref_user_genomes_featuregroup' || attachname == 'ref_user_genomes_alignment') {
    //       cur_value = this[attachname].searchBox.value;
    //       browser_select = 1;
    //     }
    //     else if (attachname == 'user_genomes_fasta') {
    //       var existing_types = [];
    //       cur_value = this[attachname].searchBox.value;
    //       var type = null;
    //       if (this[attachname].searchBox.onChange.target.item) {
    //         type = this[attachname].searchBox.onChange.target.item.type;
    //       }
    //       cur_value = { 'file': cur_value.trim(), 'type': type };
    //       var compGenomeList = query('.genomedata');
    //       var genomeIds = [];
    //       compGenomeList.forEach(function (item) {
    //         if ('user_genomes_fasta' in item.genomeRecord) {
    //           genomeIds.push(item.genomeRecord.user_genomes_fasta.file);
    //           existing_types.push(item.genomeRecord.user_genomes_fasta.type);
    //         }
    //       });
    //       if (genomeIds.length > 0 && genomeIds.indexOf(cur_value.file) > -1) // no same genome ids are allowed
    //       {
    //         success = 0;
    //       }
    //     }
    //     else if (attachname == 'user_genomes_alignment') {
    //       var existing_types = [];
    //       cur_value = this[attachname].searchBox.value;
    //       var type = null;
    //       if (this[attachname].searchBox.onChange.target.item) {
    //         type = this[attachname].searchBox.onChange.target.item.type;
    //       }
    //       cur_value = { 'file': cur_value.trim(), 'type': type };
    //       var compGenomeList = query('.genomedata');
    //       var genomeIds = [];
    //       compGenomeList.forEach(function (item) {
    //         if ('user_genomes_alignment' in item.genomeRecord) {
    //           genomeIds.push(item.genomeRecord.user_genomes_alignment.file);
    //           existing_types.push(item.genomeRecord.user_genomes_alignment.type);
    //         }
    //       });
    //       if (genomeIds.length > 0 && genomeIds.indexOf(cur_value.file) > -1) // no same genome ids are allowed
    //       {
    //         success = 0;
    //       }
    //     }
    //     else if (attachname == 'user_genomes_featuregroup') {
    //       cur_value = this[attachname].searchBox.value;
    //       var compGenomeList = query('.genomedata');
    //       var genomeIds = [];
    //       compGenomeList.forEach(function (item) {
    //         genomeIds.push(item.genomeRecord.user_genomes_featuregroup);
    //       });
    //       if (genomeIds.length > 0 && genomeIds.indexOf(cur_value) > -1)  // no same genome ids are allowed
    //       {
    //         success = 0;
    //       }
    //     }
    //     else if (attachname == 'comp_genome_id') {
    //       var compGenomeList = query('.genomedata');
    //       var genomeIds = [];
    //       compGenomeList.forEach(function (item) {
    //         genomeIds.push(item.genomeRecord.comp_genome_id);
    //       });
    //       cur_value = this[attachname].value;
    //       if (genomeIds.length > 0 && genomeIds.indexOf(cur_value) > -1)  // no same genome ids are allowed
    //       {
    //         success = 0;
    //       }
    //     }
    //     else if (attachname == 'user_genomes_genomegroup') {
    //       cur_value = this[attachname].searchBox.value;
    //       var duplicate = this.checkDuplicate(cur_value, 'user_genomes_genomegroup');
    //       success *= duplicate;
    //     }
    //     else {
    //       cur_value = this[attachname].value;
    //     }
    //     if (typeof (cur_value) == 'string') {
    //       target[attachname] = cur_value.trim();
    //     }
    //     else {
    //       target[attachname] = cur_value;
    //     }
    //     if (req && (!target[attachname] || incomplete)) {
    //       if (browser_select) {
    //         this[attachname].searchBox.validate(); // this should be whats done but it doesn't actually call the new validator
    //         this[attachname].searchBox._set('state', 'Error');
    //         this[attachname].focus = true;
    //       }
    //       success = 0;
    //     }
    //     else {
    //       this[attachname]._set('state', '');
    //     }
    //     if (target[attachname] != '') {
    //       target[attachname] = target[attachname] || undefined;
    //     }
    //     else if (target[attachname] == 'true') {
    //       target[attachname] = true;
    //     }
    //     else if (target[attachname] == 'false') {
    //       target[attachname] = false;
    //     }
    //   }, this);
    //   return (success);
    // },

    // onSuggestNameChange: function () {
    //   if (this.ref_genome_id.get('value') || this.ref_user_genomes_fasta.get('value') || this.ref_user_genomes_featuregroup.get('value') || this.ref_user_genomes_alignment.get('value')) {
    //     this.numref = 1;
    //   } else {
    //     this.numref = 0;
    //   }
    // },

    onChangeStatus: function (start) {
      this.inputInitialize();
      this.user_genomes_alignment.set('disabled', true);
      if (this.unaligned.checked == true) {
        this.unaligned_box.style.display = 'inline-block';
        this.aligned_box.style.display = 'none';
        this.onChangeType();
      } else if (this.aligned.checked == true) {
        this.unaligned_box.style.display = 'none';
        this.aligned_box.style.display = 'inline-block';
        this.user_genomes_alignment.set('required', true);
        this.user_genomes_alignment.set('disabled', false);
      }
      this.validate();
    },

    inputInitialize: function () {
      // Disable everything
      this.aligner.set('disabled', true);
      this.user_genomes_featuregroup.set('disabled', true);
      this.dna.set('disabled', true);
      this.protein.set('disabled', true);
      this.user_genomes_fasta.set('disabled', true);
      this.fasta_keyboard_input.set('disabled', true);
      this.user_genomes_alignment.set('disabled', true);
      // Do not require anything
      this.aligner.set('required', false);
      this.user_genomes_featuregroup.set('required', false);
      this.dna.set('required', false);
      this.protein.set('required', false);
      this.user_genomes_fasta.set('required', false);
      this.fasta_keyboard_input.set('required', false);
      this.user_genomes_alignment.set('required', false);
    },

    onChangeType: function () {
      this.inputInitialize();
      this.aligner.set('required', true);
      this.aligner.set('disabled', false);
      if (this.input_group.checked == true) {
        this.user_genomes_featuregroup.set('required', true);
        this.user_genomes_featuregroup.set('disabled', false);
        this.dna.set('disabled', false);
        this.protein.set('disabled', false);
      } else if (this.input_fasta.checked == true) {
        this.user_genomes_fasta.set('required', true);
        this.user_genomes_fasta.set('disabled', false);
      } else if (this.input_sequence.checked == true) {
        this.fasta_keyboard_input.set('required', true);
        this.fasta_keyboard_input.set('disabled', false);
      }
      this.validate();
    },

    // onChangeSequence: function () {
    //   if (this['fasta_keyboard_input'].value && !this.textInput) {
    //     this.textInput = true;
    //     this.addedGenomes = this.addedGenomes + 1;
    //     this.numgenomes.set('value', Number(this.addedGenomes));
    //   } else if (!this['fasta_keyboard_input'].value && this.textInput) {
    //     this.textInput = false;
    //     this.addedGenomes = this.addedGenomes - 1;
    //     this.numgenomes.set('value', Number(this.addedGenomes));
    //   }
    //   this.defaultToDNA();
    // },

    checkFasta: function () {
      // Check the FASTA data.
      var fastaText = this.fasta_keyboard_input.get('value');
      var fastaObject = this.validateFasta(fastaText);
      // Replace the FASTA data with trimmed data.
      this.fasta_keyboard_input.set('value', fastaObject.trimFasta);
      // Update the error message.
      this.sequence_message.innerHTML = fastaObject.message;
      // Set the validity and check that there are at least two sequences.
      if (fastaObject.valid && fastaObject.numseq >= 2) {
        this.validFasta = true;
        return true;
      }
      if (fastaObject.valid) {
        this.sequence_message.innerHTML = 'At least two sequences are required.';
        this.validFasta = false;
        return false;
      }
      this.validFasta = false;
      return false
    },

    // onAlphabetChanged: function () {
    //   var existing_types = this.getExistingTypes();
    //   for (var i = 0; i < existing_types.length; i++) {
    //     if (existing_types[i].includes('protein')) {
    //       this.protein.set('checked', true);
    //     }
    //   }
    // },

    // makeGenomeName: function () {
    //   var name = this.comp_genome_id.get('displayedValue');
    //   var maxName = 36;
    //   var display_name = name;
    //   if (name.length > maxName) {
    //     display_name = name.substr(0, (maxName / 2) - 2) + '...' + name.substr((name.length - (maxName / 2)) + 2);
    //   }
    //   return display_name;
    // },

    // makeFastaName: function (type, stuff) {
    //   if (stuff.includes('fasta')) {
    //     var name = this.user_genomes_fasta.searchBox.get('displayedValue');
    //   } else {
    //     var name = this.user_genomes_alignment.searchBox.get('displayedValue');
    //   }
    //   var maxName = 32;
    //   var my_type = '';
    //   if (type.includes('protein')) {
    //     my_type = 'AA: ';
    //   }
    //   else if (type.includes('dna')) {
    //     my_type = 'NT: ';
    //   }
    //   var display_name = name;
    //   if (name.length > maxName) {
    //     display_name = name.substr(0, (maxName / 2) - 2) + '...' + name.substr((name.length - (maxName / 2)) + 2);
    //   }
    //   return my_type.concat(display_name);
    // },

    // makeFeatureGroupName: function () {
    //   var name = this.user_genomes_featuregroup.searchBox.get('displayedValue');
    //   var maxName = 36;
    //   var display_name = name;
    //   if (name.length > maxName) {
    //     display_name = name.substr(0, (maxName / 2) - 2) + '...' + name.substr((name.length - (maxName / 2)) + 2);
    //   }
    //   return display_name;
    // },

    // makeGenomeGroupName: function (newGenomeIds) {
    //   var name = this[this.genomeGroupToAttachPt].searchBox.get('displayedValue');
    //   var maxName = 36;
    //   var display_name = name;
    //   if (name.length > maxName) {
    //     display_name = name.substr(0, (maxName / 2) - 2) + '...' + name.substr((name.length - (maxName / 2)) + 2);
    //   }
    //   return display_name;
    // },

    // increaseGenome: function (genomeType, newGenomeIds) {
    //   if (genomeType == 'genome' || genomeType == 'genome_group') {
    //     newGenomeIds.forEach(lang.hitch(this, function (id) {
    //       this.userGenomeList.push(id);
    //     }));
    //     this.addedGenomes = this.addedGenomes + newGenomeIds.length;
    //     this.numgenomes.set('value', Number(this.addedGenomes));
    //   } else {
    //     this.addedGenomes = this.addedGenomes + 1;
    //     this.numgenomes.set('value', Number(this.addedGenomes));
    //   }
    // },

    // decreaseGenome: function (genomeType, newGenomeIds) {
    //   if (genomeType == 'genome' || genomeType == 'genome_group') {
    //     newGenomeIds.forEach(lang.hitch(this, function (id) {
    //       var idx = this.userGenomeList.indexOf(id);
    //       if (idx > -1) {
    //         this.userGenomeList.splice(idx, 1);
    //       }
    //     }));
    //     this.addedGenomes = this.addedGenomes - newGenomeIds.length;
    //     this.numgenomes.set('value', Number(this.addedGenomes));
    //   } else {
    //     this.addedGenomes = this.addedGenomes - 1;
    //     this.numgenomes.set('value', Number(this.addedGenomes));
    //   }
    //   this.defaultToDNA();
    // },

    // defaultToDNA: function () {
    //   if (this.numgenomes.value <= 0 && this.fasta_keyboard_input.value.length <= 0) {
    //     this.dna.set('checked', true);
    //   }
    // },

    // onAddGenome: function () {
    //   var lrec = {};
    //   var chkPassed = this.ingestAttachPoints(this.genomeToAttachPt, lrec);
    //   if (chkPassed && this.addedGenomes < this.maxGenomes) {
    //     var newGenomeIds = [lrec[this.genomeToAttachPt]];
    //     var tr = this.genomeTable.insertRow(0);
    //     var td = domConstruct.create('td', { 'class': 'textcol genomedata', innerHTML: '' }, tr);
    //     td.genomeRecord = lrec;
    //     td.innerHTML = "<div class='libraryrow'>" + this.makeGenomeName() + '</div>';
    //     domConstruct.create('td', { innerHTML: '' }, tr);
    //     var td2 = domConstruct.create('td', { innerHTML: "<i class='fa icon-x fa-1x' />" }, tr);
    //     if (this.addedGenomes < this.startingRows) {
    //       this.genomeTable.deleteRow(-1);
    //     }
    //     var handle = on(td2, 'click', lang.hitch(this, function (evt) {
    //       domConstruct.destroy(tr);
    //       this.decreaseGenome('genome', newGenomeIds);
    //       if (this.addedGenomes < this.startingRows) {
    //         var ntr = this.genomeTable.insertRow(-1);
    //         domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, ntr);
    //         domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, ntr);
    //         domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, ntr);
    //       }
    //       handle.remove();
    //     }));
    //     this.increaseGenome('genome', newGenomeIds);
    //   }
    // },

    // getExistingTypes: function () {
    //   var existing_types = [];
    //   var compGenomeList = query('.genomedata');
    //   compGenomeList.forEach(function (item) {
    //     if ('user_genomes_fasta' in item.genomeRecord) {
    //       existing_types.push(item.genomeRecord.user_genomes_fasta.type);
    //     } else if ('user_genomes_alignment' in item.genomeRecord) {
    //       existing_types.push(item.genomeRecord.user_genomes_alignment.type);
    //     }
    //   });
    //   return existing_types;
    // },

    // onAddFasta: function () {
    //   var lrec = {};
    //   var chkPassed = this.ingestAttachPoints(this.fastaToAttachPt, lrec);
    //   if (chkPassed && this.addedGenomes < this.maxGenomes) {
    //     var type = lrec.user_genomes_fasta.type;
    //     var newGenomeIds = [lrec[this.fastaToAttachPt]];
    //     if (!newGenomeIds[0].file) {
    //       return;
    //     }
    //     var tr = this.genomeTable.insertRow(0);
    //     var td = domConstruct.create('td', { 'class': 'textcol genomedata', innerHTML: '' }, tr);
    //     td.genomeRecord = lrec;
    //     td.innerHTML = "<div class='libraryrow'>" + this.makeFastaName(type, 'fasta') + '</div>';
    //     domConstruct.create('td', { innerHTML: '' }, tr);
    //     var td2 = domConstruct.create('td', { innerHTML: "<i class='fa icon-x fa-1x' />" }, tr);
    //     if (this.addedGenomes < this.startingRows) {
    //       this.genomeTable.deleteRow(-1);
    //     }
    //     var handle = on(td2, 'click', lang.hitch(this, function (evt) {
    //       domConstruct.destroy(tr);
    //       this.decreaseGenome('fasta', newGenomeIds);
    //       if (this.addedGenomes < this.startingRows) {
    //         var ntr = this.genomeTable.insertRow(-1);
    //         domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, ntr);
    //         domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, ntr);
    //         domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, ntr);
    //       }
    //       handle.remove();
    //     }));
    //     this.increaseGenome('fasta', newGenomeIds);
    //     this.onAlphabetChanged();
    //   }
    // },

    // onAddFeatureGroup: function () {
    //   var lrec = {};
    //   var chkPassed = this.ingestAttachPoints(this.featureGroupToAttachPt, lrec);
    //   if (chkPassed && this.addedGenomes < this.maxGenomes) {
    //     var newGenomeIds = [lrec[this.featureGroupToAttachPt]];
    //     if (!newGenomeIds[0]) {
    //       return;
    //     }
    //     var tr = this.genomeTable.insertRow(0);
    //     var td = domConstruct.create('td', { 'class': 'textcol genomedata', innerHTML: '' }, tr);
    //     td.genomeRecord = lrec;
    //     td.innerHTML = "<div class='libraryrow'>" + this.makeFeatureGroupName() + '</div>';
    //     domConstruct.create('td', { innerHTML: '' }, tr);
    //     var td2 = domConstruct.create('td', { innerHTML: "<i class='fa icon-x fa-1x' />" }, tr);
    //     if (this.addedGenomes < this.startingRows) {
    //       this.genomeTable.deleteRow(-1);
    //     }
    //     var handle = on(td2, 'click', lang.hitch(this, function (evt) {
    //       domConstruct.destroy(tr);
    //       this.decreaseGenome('feature_group', newGenomeIds);
    //       if (this.addedGenomes < this.startingRows) {
    //         var ntr = this.genomeTable.insertRow(-1);
    //         domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, ntr);
    //         domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, ntr);
    //         domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, ntr);
    //       }
    //       handle.remove();
    //     }));
    //     this.increaseGenome('feature_group', newGenomeIds);
    //   }
    // },

    // onAddAlignment: function () {
    //   var lrec = {};
    //   var chkPassed = this.ingestAttachPoints(this.alignmentToAttachPt, lrec);
    //   if (chkPassed && this.addedGenomes < this.maxGenomes) {
    //     var type = lrec.user_genomes_alignment.type;
    //     var newGenomeIds = [lrec[this.alignmentToAttachPt]];
    //     if (!newGenomeIds[0].file) {
    //       return;
    //     }
    //     var tr = this.genomeTable.insertRow(0);
    //     var td = domConstruct.create('td', { 'class': 'textcol genomedata', innerHTML: '' }, tr);
    //     td.genomeRecord = lrec;
    //     td.innerHTML = "<div class='libraryrow'>" + this.makeFastaName(type, 'alignment') + '</div>';
    //     domConstruct.create('td', { innerHTML: '' }, tr);
    //     var td2 = domConstruct.create('td', { innerHTML: "<i class='fa icon-x fa-1x' />" }, tr);

    //     if (this.addedGenomes < this.startingRows) {
    //       this.genomeTable.deleteRow(-1);
    //     }
    //     var handle = on(td2, 'click', lang.hitch(this, function (evt) {
    //       domConstruct.destroy(tr);
    //       this.decreaseGenome('fasta', newGenomeIds);
    //       if (this.addedGenomes < this.startingRows) {
    //         var ntr = this.genomeTable.insertRow(-1);
    //         domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, ntr);
    //         domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, ntr);
    //         domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, ntr);
    //       }
    //       handle.remove();
    //     }));
    //     this.increaseGenome('fasta', newGenomeIds);
    //     this.onAlphabetChanged();
    //   }
    // },

    // // implement adding a genome group
    // onAddGenomeGroup: function () {
    //   var lrec = {};
    //   var chkPassed = this.ingestAttachPoints(this.genomeGroupToAttachPt, lrec);
    //   var path = lrec[this.genomeGroupToAttachPt];
    //   var newGenomeIds = [];
    //   when(WorkspaceManager.getObject(path), lang.hitch(this, function (res) {
    //     if (typeof res.data == 'string') {
    //       res.data = JSON.parse(res.data);
    //     }
    //     if (res && res.data && res.data.id_list) {
    //       if (res.data.id_list.genome_id) {
    //         newGenomeIds = res.data.id_list.genome_id;
    //       }
    //     }
    //     // display a notice if adding new genome group exceeds maximum allowed number
    //     var count = this.addedGenomes + newGenomeIds.length;
    //     if (count > this.maxGenomes) {
    //       var msg = 'Sorry, you can only add up to ' + this.maxGenomes + ' genomes';
    //       msg += ' and you are trying to select ' + count + '.';
    //       new Dialog({ title: 'Notice', content: msg }).show();
    //     }
    //     if (chkPassed && this.addedGenomes < this.maxGenomes
    //       && newGenomeIds.length > 0
    //       && count <= this.maxGenomes) {
    //       var tr = this.genomeTable.insertRow(0);
    //       var td = domConstruct.create('td', { 'class': 'textcol genomedata', innerHTML: '' }, tr);
    //       td.genomeRecord = lrec;
    //       td.innerHTML = "<div class='libraryrow'>" + this.makeGenomeGroupName() + '</div>';
    //       domConstruct.create('td', { innerHTML: '' }, tr);
    //       var td2 = domConstruct.create('td', { innerHTML: "<i class='fa icon-x fa-1x' />" }, tr);
    //       if (this.addedGenomes < this.startingRows) {
    //         this.genomeTable.deleteRow(-1);
    //       }
    //       var handle = on(td2, 'click', lang.hitch(this, function (evt) {
    //         domConstruct.destroy(tr);
    //         this.decreaseGenome('genome_group', newGenomeIds);
    //         if (this.addedGenomes < this.startingRows) {
    //           var ntr = this.genomeTable.insertRow(-1);
    //           domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, ntr);
    //           domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, ntr);
    //           domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, ntr);
    //         }
    //         handle.remove();
    //       }));
    //       this.increaseGenome('genome_group', newGenomeIds);
    //     }
    //   }));
    // },

    // onReset: function (evt) {
    //   this.inherited(arguments);
    //   for (var i = 0; i < this.addedGenomes; i++) {
    //     this.genomeTable.deleteRow(0);
    //   }
    //   this.emptyTable(this.genomeTable, this.addedGenomes);
    //   this.addedGenomes = 0;
    //   this.numgenomes.set('value', Number(this.addedGenomes));
    //   this.defaultToDNA();
    // },

    validate: function () {
      if (this.inherited(arguments)) {
        if (this.input_sequence.get('checked') && (!this.fasta_keyboard_input.get('value') || !this.validFasta)) {
          this.submitButton.set('disabled', true);
          return false;
        }
        this.submitButton.set('disabled', false);
        return true;
      }
      this.submitButton.set('disabled', true);
      return false;
    },

    // validate: function () {
    //   if (this.inherited(arguments)) {
    //     var values = this.getValues();
    //     var feature_groups_count = 0;
    //     var fasta_files_count = 0;
    //     if (values.feature_groups) {
    //       feature_groups_count = values.feature_groups.length;
    //     }
    //     if (values.fasta_files) {
    //       fasta_files_count = values.fasta_files.length;
    //     }
    //     if (this.validateFasta() && (feature_groups_count >= 1 || fasta_files_count >= 1 || values.fasta_keyboard_input)) {
    //       return true;
    //     }
    //   }
    //   return false;
    // },

    getValues: function () {
      var values = this.inherited(arguments);
      if (!values.fasta_keyboard_input) {
        values.fasta_keyboard_input = '';
      }
      if (values.user_genomes_featuregroup) {
        var featureGroups = [values.user_genomes_featuregroup];
        values.feature_groups = featureGroups;
        delete values.user_genomes_featuregroup;
      }
      var fastaFiles = [];
      var my_input_type = '';
      if (values.user_genomes_alignment) {
        my_input_type = 'user_genomes_alignment';
      } else if (values.user_genomes_fasta) {
        my_input_type = 'user_genomes_fasta';
      }
      if (!values.alphabet) {
        values.alphabet = 'dna';
      }
      if (my_input_type) {
        var rec = {};
        rec.type = this[my_input_type].searchBox.onChange.target.item.type;
        if (rec.type.search('protein') > -1) {
          values.alphabet = 'protein';
        }
        rec.file = this[my_input_type].get('value');
        fastaFiles.push(rec);
        delete values[my_input_type];
      }
      if (fastaFiles.length > 0) {
        values.fasta_files = fastaFiles;
      }
      return values;
    },

    // getValues: function () {
    //   var seqcomp_values = {};
    //   var values = this.inherited(arguments);
    //   console.log(values);
    //   var compGenomeList = query('.genomedata');
    //   var userGenomes = [];
    //   var featureGroups = [];
    //   if (values.ref_user_genomes_fasta) {
    //     userGenomes.push(values.ref_user_genomes_fasta);
    //   }
    //   if (values.ref_user_genomes_featuregroup) {
    //     featureGroups.push(values.ref_user_genomes_featuregroup);
    //   }
    //   compGenomeList.forEach(function (item) {
    //     if (item.genomeRecord.user_genomes_fasta) {
    //       userGenomes.push(item.genomeRecord.user_genomes_fasta);
    //     } else if (item.genomeRecord.user_genomes_featuregroup) {
    //       featureGroups.push(item.genomeRecord.user_genomes_featuregroup);
    //     } else if (item.genomeRecord.user_genomes_alignment) {
    //       userGenomes.push(item.genomeRecord.user_genomes_alignment);
    //     }
    //   });
    //   if (userGenomes.length > 0) {
    //     seqcomp_values.fasta_files = userGenomes;
    //   }
    //   if (featureGroups.length > 0) {
    //     seqcomp_values.feature_groups = featureGroups;
    //   }
    //   seqcomp_values.aligner = values.aligner;
    //   seqcomp_values = this.checkBaseParameters(values, seqcomp_values);

    //   seqcomp_values.fasta_keyboard_input = values.fasta_keyboard_input;
    //   seqcomp_values.fasta_keyboard_input = seqcomp_values.fasta_keyboard_input.replace(/^\s*[\r\n]/gm, '');
    //   seqcomp_values.alphabet = values.alphabet;
    //   return seqcomp_values;
    // },

    checkBaseParameters: function (values, seqcomp_values) {
      seqcomp_values.output_path = values.output_path;
      this.output_folder = values.output_path;
      seqcomp_values.output_file = values.output_file;
      this.output_name = values.output_file;
      return seqcomp_values;
    },

    intakeRerunForm: function () {
      var localStorage = window.localStorage;
      if (localStorage.hasOwnProperty("bvbrc_rerun_job")) {
        var param_dict = { "output_folder": "output_path", "strategy": "aligner" };
        var service_specific = { "fasta_keyboard_input": "fasta_keyboard_input" };
        param_dict["service_specific"] = service_specific;
        var job_data = JSON.parse(localStorage.getItem("bvbrc_rerun_job"));
        this.setAlphabetFormFill(job_data);
        AppBase.prototype.intakeRerunFormBase.call(this, param_dict);
        this.addSequenceFilesFormFill(job_data);
        localStorage.removeItem("bvbrc_rerun_job");
        this.form_flag = true;
      }
    },

    setAlphabetFormFill: function (job_data) {
      if (job_data["alphabet"] == "DNA") {
        this.protein.set("checked", false);
        this.dna.set("checked", true);
      }
      else {
        this.dna.set("checked", false);
        this.protein.set("checked", true);
      }
      this.onAlphabetChanged();
    },

    addSequenceFilesFormFill: function (job_data) {
      if (job_data.hasOwnProperty("fasta_files") && job_data.hasOwnProperty("feature_groups")) {
        var sequence_files = job_data["fasta_files"].concat(job_data["feature_groups"]);
      }
      else if (job_data.hasOwnProperty("fasta_files")) {
        var sequence_files = job_data["fasta_files"];
      }
      else {
        var sequence_files = job_data["feature_groups"];
      }
      sequence_files.forEach(function (seq_file) {
        if (seq_file.hasOwnProperty("type")) { //fasta file
          var lrec = { "user_genomes_alignment": { "file": seq_file.file, "type": seq_file.type } };
          var newGenomeIds = [lrec.user_genomes_alignment.file];
          var seq_type = 'fasta';
        }
        else { //feature group
          var seq_type = 'feature_group';
          var lrec = { "user_genomes_featuregroup": { "file": seq_file, "type": seq_type } };;
          var newGenomeIds = [lrec];
        }
        var tr = this.genomeTable.insertRow(0);
        var td = domConstruct.create('td', { 'class': 'textcol genomedata', innerHTML: '' }, tr);
        td.genomeRecord = lrec;
        td.innerHTML = "<div class='libraryrow'>" + this.makeFormFillName(newGenomeIds[0].split("/").pop()) + "</div>";
        domConstruct.create('td', { innerHTML: '' }, tr);
        var td2 = domConstruct.create('td', { innerHTML: "<i class='fa icon-x fa-1x' />" }, tr);
        if (this.addedGenomes < this.startingRows) {
          this.genomeTable.deleteRow(-1);
        }
        var handle = on(td2, 'click', lang.hitch(this, function (evt) {
          console.log("Delete Row");
          domConstruct.destroy(tr);
          this.decreaseGenome(seq_type, newGenomeIds);
          if (this.addedGenomes < this.startingRows) {
            var ntr = this.genomeTable.insertRow(-1);
            domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, ntr);
            domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, ntr);
            domConstruct.create('td', { innerHTML: "<div class='emptyrow'></div>" }, ntr);
          }
          handle.remove();
        }));
        this.increaseGenome(seq_type, newGenomeIds);
        if (seq_type == 'fasta') {
          this.onAlphabetChanged();
        }
      }, this);
    },

    //TODO: add type (AA:, NT:)
    makeFormFillName: function (name) {
      var display_name = name;
      var maxName = 36;
      if (name.length > maxName) {
        display_name = name.substr(0, (maxName / 2) - 2) + '...' + name.substr((name.length - (maxName / 2)) + 2);
      }
      return display_name;
    }

  });
});
