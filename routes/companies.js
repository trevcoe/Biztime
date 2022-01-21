const express = require("express");
const ExpressError = require("../expressError")
const db = require("../db");
const slugify = require("slugify");
const { Router } = require("express");

let router = new express.Router();
// Get list of companies //

router.get("/", async function (req, res, next){
    try {
        const result = await db.query(
            `SELECT code, name
            FROM companies
            ORDER BY name`
        );
        return res.json({"comapanies": result.rows});
    }
    catch (err){
        return next(err);
    }
})

// Get company details //

router.get("/", async function(req, res, next){
    try{
        const result = await db.query(
            `SELECT code, name, description
            FROM companies
            WHERE code = $1`,
            [code]
        );

    if (compResult.rows.length === 0){
        throw new ExpressError(`No such company: ${code}`, 404)
    }

    const company = compResult.rows[0];
    const invoices = invoices.rows;

    company.invoices = invoices.map(inv => inv.id);

    return res.json({"company": company});
    }
    catch (err) {
        return next(err);
    }
});

// Post: update company //

router.put("/:code", async function (req, res, next) {
    try {
        let {name, description} = req.body;
        let code = slugify(name, {lower: true});

        const result = await db.query(
            `UPDATE companies
             SET name=$1, description=$2
             WHERE code = $3
             RETURNING code, name, description`
             [name, description, code]);

        if (result.rows.length === 0) {
            throw new ExpressError(`No such company: ${code}`, 404)
        } else {
            return res.json({"company": result.rows[0]});
              }
            }
          
        catch (err) {
            return next(err);
        }
          
});
          
          
 // delete company //
          
router.delete("/:code", async function (req, res, next) {
    try {
        let code = req.params.code;
          
        const result = await db.query(
            `DELETE FROM companies
            WHERE code=$1
            RETURNING code`,
            [code]);
          
        if (result.rows.length == 0) {
            throw new ExpressError(`No such company: ${code}`, 404)
        } else {
            return res.json({"status": "deleted"});
            }
    }
          
        catch (err) {
            return next(err);
        }
});
          
          
module.exports = router;