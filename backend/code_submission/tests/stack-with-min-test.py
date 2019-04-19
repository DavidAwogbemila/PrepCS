import submission
import json

# Use table tests.
# map input to expected output.
TESTS = [
   (
     # Test case 1.
	 [2, 3, 1, 4, 5], 1
  ),
]


def run_tests():
	# Implement tests here.
	all_tests_passed = True
	num_tests_passed = 0
	num_tests_run = 0
	pass_fail_by_index = []
	inputs = []
	outputs = []
	for test in TESTS:
		inputs.append(test[0])
		test_stack = submission.Stack()
		for i in test[0]:
			test_stack.push(i)

		ans = test_stack.min()
		outputs.append(ans)
		
		if ans == test[1]:
			num_tests_passed += 1
			pass_fail_by_index.append("PASS")
		else:
			pass_fail_by_index.append("FAIL")
		num_tests_run += 1
		return {
		"num_run": num_tests_run,
		"num_passed": num_tests_passed,
		"inputs": inputs,
		"pass_fail_by_index": pass_fail_by_index,
		"outputs": outputs
	}


def main():
    result_dictionary = run_tests()
    print(json.dumps(result_dictionary))


if __name__ == "__main__":
    main()
