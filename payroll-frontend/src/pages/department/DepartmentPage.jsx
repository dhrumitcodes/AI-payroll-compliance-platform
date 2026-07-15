import Layout from "../../components/layout/Layout";

function DepartmentPage() {

    return (

        <Layout>

            <h1 className="text-4xl font-bold mb-6">
                Department Management
            </h1>

            <div className="bg-white rounded-xl shadow p-6">

                <div className="flex justify-between mb-6">

                    <h2 className="text-2xl font-semibold">
                        Departments
                    </h2>

                    <button className="bg-green-600 text-white px-5 py-2 rounded-lg">
                        + Add Department
                    </button>

                </div>

                <table className="w-full">

                    <thead>

                    <tr>

                        <th className="text-left py-3">Department</th>
                        <th className="text-left">Manager</th>
                        <th className="text-left">Employees</th>

                    </tr>

                    </thead>

                    <tbody>

                    <tr>

                        <td className="py-4">IT</td>
                        <td>John</td>
                        <td>32</td>

                    </tr>

                    </tbody>

                </table>

            </div>

        </Layout>

    );

}

export default DepartmentPage;