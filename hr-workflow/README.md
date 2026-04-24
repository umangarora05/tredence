# HR Workflow Designer (React + React Flow Prototype)

This project is a functional prototype of an HR Workflow Designer Module built for the Tredence Studio AI Agentic Engineering internship case study.

## Core Objective
Design and implement a standalone mini-HR Workflow Designer module where an admin can visually create, configure, and simulate internal workflows.

## Technology Stack & Libraries
- **React (Vite + TypeScript)**: Standard fast foundational scaffold with full type safety.
- **Tailwind CSS (v4)**: For rapid, clean, and responsive styling.
- **React Flow (@xyflow/react)**: Powers the drag-and-drop workflow canvas, node connections, dragging, and panning behaviors.
- **Zustand**: A lightweight, boilerplate-free state manager used for managing Nodes, Edges, and current node selection across multiple components.
- **Lucide React**: Clean vector icons for UI aesthetics.

## Folder Structure
```
src/
├── api/
│   └── mockApi.ts         # Service layer wrapping our mock API definitions and simulation logic.
├── components/
│   ├── canvas/            # Contains CustomNodes registered with React flow.
│   ├── forms/             # The NodeConfigPanel logic dynamic to node type.
│   ├── sandbox/           # Workflow execution logs modal and simulation trigger.
│   └── sidebar/           # Draggable node palette.
├── store/
│   └── workflowStore.ts   # Zustand global store containing active canvas state.
├── types/
│   └── workflow.ts        # Typescript interfaces mapping the structural contracts for our Nodes and Mock API.
├── App.tsx                # Main Entry layout orchestrating the various panels.
└── index.css              # Global styles & Tailwind entry.
```

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the Development Server:**
   ```bash
   npm run dev
   ```

3. **View in Browser:**
   Navigate to `http://localhost:5173/`

## Key Architecture & Design Decisions

1. **State Management (Zustand):**
   Instead of lifting state to `<App />` and drilling props down heavily (or suffering React Context re-render performance hits), the React Flow canvas state (Nodes, Edges) and transient UI State (Selected Node) are centralized in a standalone `Zustand` store (`useWorkflowStore`). This drastically simplifies component communication (e.g. the Sidebar doesn't need to be tightly coupled to the Canvas).

2. **Dynamic Configuration Form:**
   The `NodeConfigPanel` derives its UI deeply from the currently selected node's `type` field using a unified `renderFields` switch statement. This ensures high modularity; adding a new "Webhook Node" is as straightforward as registering a new visual node and adding a new switch case in the form.

3. **In-Memory Mock API:**
   For a true "zero-setup" evaluation, the "Mock API" endpoints (`/automations` and `/simulate`) were modeled as simulated async Service functions directly in `src/api/mockApi.ts`. The simulation performs a basic structural graph traversal checking for isolated node clusters and cycles, logging its steps out to the UI.

4. **React Flow Integration:**
   Dropping nodes from standard HTML5 drag layers into the React Flow coordinate system requires mapping the drop event client coordinates over to projected React Flow coordinates using the wrapper offsets.

## Missing Deliverables / Future Work (If more time permitted)
- **Deep Validation Error Highlighting:** Adding little red warning icons directly onto nodes via `<Handle>` invalidations on the canvas itself natively.
- **Save/Load Workflows:** Writing actual LocalStorage serializations.
- **Edge Conditions:** Adding forms to explicitly define branching logic on Approval nodes (e.g., configuring *Approved* vs *Rejected* pathing). 

*Built by Assistant for Tredence Studio Full Stack Intern Application Case Study.*
