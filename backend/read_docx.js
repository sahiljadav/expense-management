const mammoth = require("mammoth");

mammoth.extractRawText({path: "docs/Project Description with Timeline/1_Expense_Manager_Docs.docx"})
    .then(function(result){
        let text = result.value;
        console.log(text);
    })
    .catch(function(err) {
        console.error("Error extracting text:", err);
    });
