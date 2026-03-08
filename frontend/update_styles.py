import os
import re

# ------------- APP.CSS -------------
path_app = r"d:\EDI SEM4\frontend\src\App.css"
with open(path_app, "r", encoding="utf-8") as f:
    css_app = f.read()

# Replace variables
css_app = css_app.replace("--primary: #6366f1", "--primary: #2563eb")
css_app = css_app.replace("--primary-dark: #4f46e5", "--primary-dark: #1d3572")
css_app = css_app.replace("--primary-light: #818cf8", "--primary-light: #3b82f6")

css_app = css_app.replace("--bg-primary: #0f172a", "--bg-primary: #f8fafc")
css_app = css_app.replace("--bg-secondary: #1e293b", "--bg-secondary: #ffffff")
css_app = css_app.replace("--bg-tertiary: #334155", "--bg-tertiary: #f1f5f9")

css_app = css_app.replace("--text-primary: #f1f5f9", "--text-primary: #1e293b")
css_app = css_app.replace("--text-secondary: #cbd5e1", "--text-secondary: #475569")
css_app = css_app.replace("--text-muted: #94a3b8", "--text-muted: #64748b")

css_app = css_app.replace("--border: #475569", "--border: #e2e8f0")

# Update card shadow and other elements to match soft neumorphism
css_app = css_app.replace("--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)", "--shadow-md: 0 10px 40px -10px rgba(0, 0, 0, 0.08)")
css_app = css_app.replace("--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)", "--shadow-lg: 0 15px 30px rgba(0, 0, 0, 0.1)")
css_app = css_app.replace("--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)", "--shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.15)")
css_app = css_app.replace("--radius-lg: 0.75rem", "--radius-lg: 16px")
css_app = css_app.replace("--radius-xl: 1rem", "--radius-xl: 24px")

with open(path_app, "w", encoding="utf-8") as f:
    f.write(css_app)

# ------------- STUDENTAPP.CSS -------------
path_student = r"d:\EDI SEM4\frontend\src\StudentApp.css"
with open(path_student, "r", encoding="utf-8") as f:
    css_student = f.read()

css_student = css_student.replace("color: #e0e0ff", "color: #1e293b")
css_student = css_student.replace("color: #8888aa", "color: #64748b")
css_student = css_student.replace("color: #c0c0e0", "color: #1e293b")
css_student = css_student.replace("color: #b0b0d0", "color: #1e293b")
css_student = css_student.replace("color: #666688", "color: #94a3b8")
css_student = css_student.replace("color: white", "color: #ffffff")

css_student = css_student.replace("background: linear-gradient(135deg, #0a0e27 0%, #1a1a4e 40%, #2d1b69 70%, #0f3460 100%)", "background: linear-gradient(135deg, #0f1c3f 0%, #1d3572 100%)")
css_student = css_student.replace("background: rgba(20, 20, 50, 0.85)", "background: rgba(255, 255, 255, 0.95)")
css_student = css_student.replace("background: rgba(20, 20, 50, 0.9)", "background: #f8fafc")
css_student = css_student.replace("background: rgba(15, 15, 40, 0.95)", "background: #ffffff")
css_student = css_student.replace("background: rgba(20, 20, 50, 0.6)", "background: #ffffff")
css_student = css_student.replace("background: #0a0e1a", "background: #f8fafc")

css_student = css_student.replace("border: 1px solid rgba(255, 255, 255, 0.06)", "border: 1px solid #e2e8f0; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05)")
css_student = css_student.replace("border-right: 1px solid rgba(255, 255, 255, 0.06)", "border-right: 1px solid #e2e8f0")
css_student = css_student.replace("border-bottom: 1px solid rgba(255, 255, 255, 0.04)", "border-bottom: 1px solid #e2e8f0")
css_student = css_student.replace("border-top: 1px solid rgba(255, 255, 255, 0.04)", "border-top: 1px solid #e2e8f0")
css_student = css_student.replace("border: 1px solid rgba(120, 100, 255, 0.15)", "border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.05)")

css_student = css_student.replace("background: rgba(255, 255, 255, 0.06)", "background: #f1f5f9")
css_student = css_student.replace("background: rgba(255, 255, 255, 0.03)", "background: #f8fafc")
css_student = css_student.replace("background: rgba(255, 255, 255, 0.04)", "background: #f1f5f9")

with open(path_student, "w", encoding="utf-8") as f:
    f.write(css_student)
