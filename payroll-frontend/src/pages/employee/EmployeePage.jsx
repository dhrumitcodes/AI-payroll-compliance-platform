import Layout from "../../components/layout/Layout";

function EmployeePage() {

    return (

        <Layout>

            <h1 className="text-4xl font-bold mb-6">
                Employee Management
            </h1>

            <div className="bg-white rounded-xl shadow p-6">

                <div className="flex justify-between mb-6">

                    <h2 className="text-2xl font-semibold">
                        Employees
                    </h2>

                    <button className="bg-purple-600 text-white px-5 py-2 rounded-lg">
                        + Add Employee
                    </button>

                </div>

                <table className="w-full">

                    <thead>

                    <tr>

                        <th className="text-left py-3">Name</th>
                        <th className="text-left">Department</th>
                        <th className="text-left">Email</th>
                        <th className="text-left">Salary</th>

                    </tr>

                    </thead>

                    <tbody>

                    <tr>

                        <td className="py-4">Dhruv</td>
                        <td>IT</td>
                        <td>dhruv@gmail.com</td>
                        <td>₹50,000</td>

                    </tr>

                    </tbody>

                </table>

            </div>

        </Layout>

    );

}

export default EmployeePage;