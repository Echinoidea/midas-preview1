"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/uploadRiskLookupStream.ts
var fs = require("fs");
var csv_parse_1 = require("csv-parse");
var prisma_1 = require("../lib/prisma");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var filePath, parser, batchSize, batch, totalInserted, _a, parser_1, parser_1_1, record, gender, ethnicity, ell, schoolLevel, mathRisk, readingRisk, mysaebrsEmo, mysaebrsSoc, mysaebrsAca, saebrsEmo, saebrsSoc, saebrsAca, officeReferrals, suspensions, id, dataRow, result, e_1_1, result;
        var _b, e_1, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    filePath = "/home/gabriel/code/data/MIDAS Website/data/web_input_values_new.csv";
                    parser = fs.createReadStream(filePath).pipe((0, csv_parse_1.parse)({
                        columns: true,
                        skip_empty_lines: true,
                        trim: true,
                    }));
                    batchSize = 3000;
                    batch = [];
                    totalInserted = 0;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 7, 8, 13]);
                    _a = true, parser_1 = __asyncValues(parser);
                    _e.label = 2;
                case 2: return [4 /*yield*/, parser_1.next()];
                case 3:
                    if (!(parser_1_1 = _e.sent(), _b = parser_1_1.done, !_b)) return [3 /*break*/, 6];
                    _d = parser_1_1.value;
                    _a = false;
                    record = _d;
                    gender = record["gender"].toUpperCase();
                    ethnicity = record["ethnicity"].trim().toUpperCase();
                    if (ethnicity === "OTHER POC" || ethnicity === "OTHERPOC" || ethnicity == "Other POC") {
                        ethnicity = "OTHER_POC";
                    }
                    ell = record["ell"].toLowerCase() === "yes";
                    schoolLevel = record["schoollevel"].toUpperCase();
                    mathRisk = record["math_f"].toUpperCase();
                    readingRisk = record["read_f"].toUpperCase();
                    mysaebrsEmo = record["mysaebrs_emo"].toUpperCase();
                    mysaebrsSoc = record["mysaebrs_soc"].toUpperCase();
                    mysaebrsAca = record["mysaebrs_aca"].toUpperCase();
                    saebrsEmo = record["saebrs_emo"].toUpperCase();
                    saebrsSoc = record["saebrs_soc"].toUpperCase();
                    saebrsAca = record["saebrs_aca"].toUpperCase();
                    officeReferrals = record["odr_f"].toLowerCase() === "one+";
                    suspensions = record["susp_f"].toLowerCase() === "one+";
                    id = Number(record["id"]);
                    dataRow = {
                        id: id, // Optional: include if you need to preserve the CSV id.
                        officeReferrals: officeReferrals,
                        suspensions: suspensions,
                        gender: gender,
                        ethnicity: ethnicity,
                        ell: ell,
                        schoolLevel: schoolLevel,
                        mathRisk: mathRisk,
                        readingRisk: readingRisk,
                        mysaebrsEmo: mysaebrsEmo,
                        mysaebrsSoc: mysaebrsSoc,
                        mysaebrsAca: mysaebrsAca,
                        saebrsEmo: saebrsEmo,
                        saebrsSoc: saebrsSoc,
                        saebrsAca: saebrsAca,
                    };
                    batch.push(dataRow);
                    if (!(batch.length >= batchSize)) return [3 /*break*/, 5];
                    return [4 /*yield*/, prisma_1.default.riskLookup.createMany({
                            data: batch,
                            skipDuplicates: true, // if duplicates exist, skip them
                        })];
                case 4:
                    result = _e.sent();
                    totalInserted += result.count;
                    console.log("Inserted ".concat(result.count, " records"));
                    batch = [];
                    _e.label = 5;
                case 5:
                    _a = true;
                    return [3 /*break*/, 2];
                case 6: return [3 /*break*/, 13];
                case 7:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 8:
                    _e.trys.push([8, , 11, 12]);
                    if (!(!_a && !_b && (_c = parser_1.return))) return [3 /*break*/, 10];
                    return [4 /*yield*/, _c.call(parser_1)];
                case 9:
                    _e.sent();
                    _e.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 12: return [7 /*endfinally*/];
                case 13:
                    if (!(batch.length > 0)) return [3 /*break*/, 15];
                    return [4 /*yield*/, prisma_1.default.riskLookup.createMany({
                            data: batch,
                            skipDuplicates: true,
                        })];
                case 14:
                    result = _e.sent();
                    totalInserted += result.count;
                    console.log("Inserted ".concat(result.count, " records"));
                    _e.label = 15;
                case 15:
                    console.log("Total records inserted: ".concat(totalInserted));
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (error) {
    console.error("Error uploading RiskLookup data:", error);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
