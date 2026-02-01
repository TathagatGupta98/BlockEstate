import { Company } from "../models/company.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ===========================
   Register Company
=========================== */
export const registerCompany = async (req, res) => {
  try {
    const { name, walletAddress, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: "Name and password required" });
    }

    const existing = await Company.findOne({ name });

    if (existing) {
      return res.status(409).json({ message: "Company already exists" });
    }

    const company = await Company.create({
      name,
      walletAddress,
      password
    });

    res.status(201).json({
      message: "Company registered successfully",
      company
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ===========================
   Login Company
=========================== */
export const loginCompany = async (req, res) => {
  try {
    const { name, password } = req.body;

    const company = await Company.findOne({ name });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = company.generateAccessToken();

    res.json({
      message: "Login successful",
      token,
      company
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ===========================
   Get All Companies
=========================== */
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().select("-password");

    res.json(companies);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ===========================
   Get Company By ID
=========================== */
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id).select("-password");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ===========================
   Update Company
=========================== */
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Company.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({
      message: "Company updated",
      updated
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ===========================
   Delete Company
=========================== */
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Company.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({ message: "Company deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
