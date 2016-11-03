Ext.define('Ext.grid.plugin.override.RowEditing', {
    override: 'Ext.grid.plugin.RowEditing',

    onEnterKey: function(e) {
        var me = this,
        targetComponent,
        targetDataComponent;
    
        // KeyMap entry for EnterKey added after the entry that sets actionable mode, so this will get called 
        // after that handler. We must ignore ENTER key in actionable mode. 
        if (!me.grid.ownerGrid.actionableMode && me.editing) {
            targetComponent = Ext.getCmp(e.getTarget().getAttribute('componentId'));
            targetDataComponent = Ext.getCmp(e.getTarget().getAttribute('data-componentid'));
 
            // ENTER when a picker is expanded does not complete the edit 
            if (!(targetComponent && targetComponent.isPickerField && targetComponent.isExpanded) &&
                !(targetDataComponent && targetDataComponent instanceof Ext.form.field.TextArea)) {
                me.completeEdit();
            }
        }
    }
});