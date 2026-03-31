const supabase = require("../config/supabase");

// Get all projects for the logged-in user
exports.getProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, icon, color, progress, docs } = req.body;

    const newProject = {
      user_id: userId,
      name,
      description: description || "No description yet",
      icon: icon || "📁",
      color: color || "#6366f1",
      progress: progress || 0,
      docs: docs || 0,
    };

    const { data, error } = await supabase
      .from("projects")
      .insert([newProject])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Project not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
